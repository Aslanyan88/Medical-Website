// app/api/appointments/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET specific appointment
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        timeSlot: true,
      },
    });
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to view this appointment
    if (appointment.patientId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to view this appointment' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// UPDATE appointment (reschedule)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { date, timeSlotId, reason, notes, oldTimeSlotId } = data;
    
    if (!date || !timeSlotId) {
      return NextResponse.json(
        { error: 'Date and time slot are required' },
        { status: 400 }
      );
    }
    
    // Get the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });
    
    // Check if the appointment exists
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to update this appointment
    if (appointment.patientId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to update this appointment' },
        { status: 403 }
      );
    }
    
    // Check if the appointment is already cancelled or completed
    if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot update an appointment that is already cancelled or completed' },
        { status: 400 }
      );
    }
    
    // Check if the selected time slot is available
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
    });
    
    if (!timeSlot || !timeSlot.isAvailable) {
      return NextResponse.json(
        { error: 'Selected time slot is not available' },
        { status: 400 }
      );
    }
    
    // Get the time from the time slot
    const time = timeSlot.startTime;
    
    // Start a transaction to update appointment and time slots
    const updatedAppointment = await prisma.$transaction(async (tx) => {
      // Make the old time slot available again if it exists
      if (oldTimeSlotId) {
        await tx.timeSlot.update({
          where: { id: oldTimeSlotId },
          data: {
            isAvailable: true,
          },
        });
      }
      
      // Update the time slot to not available
      await tx.timeSlot.update({
        where: {
          id: timeSlotId,
        },
        data: {
          isAvailable: false,
        },
      });
      
      // Update the appointment
      return await tx.appointment.update({
        where: { id },
        data: {
          date: new Date(date),
          time,
          reason,
          notes,
          timeSlotId,
        },
      });
    });
    
    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}