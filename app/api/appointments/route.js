import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// GET all appointments for the logged-in user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;

    // Check if user is admin or requesting their own appointments
    if (!session.user.isAdmin && userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: userId,
      },
      include: {
        doctor: true,
        timeSlot: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST create a new appointment
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { doctorId, patientId, date, timeSlotId, reason, notes } = data;

    // Validate required fields
    if (!doctorId || !patientId || !date || !timeSlotId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user is admin or creating appointment for themselves
    if (!session.user.isAdmin && patientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if the time slot exists and is available
    const timeSlot = await prisma.timeSlot.findUnique({
      where: {
        id: timeSlotId,
      },
    });

    if (!timeSlot || !timeSlot.isAvailable) {
      return NextResponse.json(
        { error: 'Time slot not available' },
        { status: 400 }
      );
    }

    // Extract the time from the time slot
    const time = timeSlot.startTime;

    // Start a transaction to create appointment and update time slot
    const appointment = await prisma.$transaction(async (tx) => {
      // Create the appointment
      const newAppointment = await tx.appointment.create({
        data: {
          doctorId,
          patientId,
          date: new Date(date),
          time,
          reason,
          notes,
          status: 'SCHEDULED',
          timeSlotId,
        },
      });

      // Update the time slot to not available
      await tx.timeSlot.update({
        where: {
          id: timeSlotId,
        },
        data: {
          isAvailable: false,
        },
      });

      return newAppointment;
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}