// app/api/admin/doctors/[doctorId]/timeslots/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]/route';

// Get timeslots for a doctor
export async function GET(request, { params }) {
  try {
    const { doctorId } = params;
    
    const timeSlots = await prisma.timeSlot.findMany({
      where: { doctorId },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' }
      ]
    });
    
    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error('Error fetching timeslots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeslots' },
      { status: 500 }
    );
  }
}

// Add a new timeslot for a doctor
export async function POST(request, { params }) {
  try {
    // Check for admin rights
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { doctorId } = params;
    const data = await request.json();
    
    // Validate required fields
    if (!data.day || !data.startTime || !data.endTime) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }
    
    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Create timeslot
    const timeslot = await prisma.timeSlot.create({
      data: {
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        doctorId: doctorId
      }
    });
    
    return NextResponse.json(timeslot, { status: 201 });
  } catch (error) {
    console.error('Error creating timeslot:', error);
    return NextResponse.json(
      { error: 'Failed to create timeslot' },
      { status: 500 }
    );
  }
}