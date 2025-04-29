// app/api/appointments/[id]/cancel/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

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
    
    // Get the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { timeSlot: true },
    });
    
    // Check if the appointment exists
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to cancel this appointment
    if (appointment.patientId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to cancel this appointment' },
        { status: 403 }
      );
    }
    
    // Check if the appointment is already cancelled or completed
    if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel an appointment that is already cancelled or completed' },
        { status: 400 }
      );
    }
    
    // Start a transaction
    const cancelledAppointment = await prisma.$transaction(async (tx) => {
      // Update the appointment status
      const updated = await tx.appointment.update({
        where: { id },
        data: {
          status: 'CANCELLED',
        },
      });
      
      // Make the time slot available again if it exists
      if (appointment.timeSlotId) {
        await tx.timeSlot.update({
          where: { id: appointment.timeSlotId },
          data: {
            isAvailable: true,
          },
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