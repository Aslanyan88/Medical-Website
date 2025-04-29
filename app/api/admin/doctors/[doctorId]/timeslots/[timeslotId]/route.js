// app/api/admin/timeslots/[timeslotId]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

// Get a single timeslot
export async function GET(request, { params }) {
  try {
    const { timeslotId } = params;
    
    const timeslot = await prisma.timeSlot.findUnique({
      where: { id: timeslotId }
    });
    
    if (!timeslot) {
      return NextResponse.json(
        { error: 'Timeslot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(timeslot);
  } catch (error) {
    console.error('Error fetching timeslot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeslot' },
      { status: 500 }
    );
  }
}

// Update a timeslot
export async function PUT(request, { params }) {
  try {
    // Check for admin rights
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { timeslotId } = params;
    const data = await request.json();
    
    // Validate required fields
    if (!data.day || !data.startTime || !data.endTime) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }
    
    // Check if timeslot exists
    const timeslot = await prisma.timeSlot.findUnique({
      where: { id: timeslotId }
    });
    
    if (!timeslot) {
      return NextResponse.json(
        { error: 'Timeslot not found' },
        { status: 404 }
      );
    }
    
    // Check if timeslot is being used by an appointment
    const appointment = await prisma.appointment.findUnique({
      where: { timeSlotId: timeslotId }
    });
    
    // If the timeslot is booked but we're trying to make it available,
    // we need to handle this conflict
    if (appointment && data.isAvailable === true) {
      return NextResponse.json(
        { error: 'Cannot mark as available: this timeslot is already booked' },
        { status: 400 }
      );
    }
    
    // Update timeslot
    const updatedTimeslot = await prisma.timeSlot.update({
      where: { id: timeslotId },
      data: {
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        isAvailable: data.isAvailable
      }
    });
    
    return NextResponse.json(updatedTimeslot);
  } catch (error) {
    console.error('Error updating timeslot:', error);
    return NextResponse.json(
      { error: 'Failed to update timeslot' },
      { status: 500 }
    );
  }
}

// Delete a timeslot
export async function DELETE(request, { params }) {
  try {
    // Check for admin rights
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { timeslotId } = params;
    
    // Check if timeslot exists
    const timeslot = await prisma.timeSlot.findUnique({
      where: { id: timeslotId }
    });
    
    if (!timeslot) {
      return NextResponse.json(
        { error: 'Timeslot not found' },
        { status: 404 }
      );
    }
    
    // Check if timeslot is being used by an appointment
    const appointment = await prisma.appointment.findUnique({
      where: { timeSlotId: timeslotId }
    });
    
    if (appointment) {
      return NextResponse.json(
        { error: 'Cannot delete: this timeslot is currently booked' },
        { status: 400 }
      );
    }
    
    // Delete timeslot
    await prisma.timeSlot.delete({
      where: { id: timeslotId }
    });
    
    return NextResponse.json({ message: 'Timeslot deleted successfully' });
  } catch (error) {
    console.error('Error deleting timeslot:', error);
    return NextResponse.json(
      { error: 'Failed to delete timeslot' },
      { status: 500 }
    );
  }
}