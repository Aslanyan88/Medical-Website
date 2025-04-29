// app/api/admin/appointments/[id]/cancel/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]/route';

// Cancel an appointment
export async function PUT(request, { params }) {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Find the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Check authorization
    if (!session.user.isAdmin && appointment.patientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Can only cancel scheduled or confirmed appointments
    if (appointment.status !== 'SCHEDULED' && appointment.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Cannot cancel a completed or already cancelled appointment' },
        { status: 400 }
      );
    }
    
    // Start a transaction to update appointment and timeslot
    const cancelledAppointment = await prisma.$transaction(async (tx) => {
      // Update appointment status to CANCELLED
      const updated = await tx.appointment.update({
        where: { id },
        data: {
          status: 'CANCELLED'
        },
        include: {
          doctor: true,
          patient: true,
          timeSlot: true
        }
      });
      
      // If there was a timeslot, mark it as available again
      if (appointment.timeSlotId) {
        await tx.timeSlot.update({
          where: { id: appointment.timeSlotId },
          data: { isAvailable: true }
        });
      }
      
      return updated;
    });
    
    return NextResponse.json(cancelledAppointment);
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}