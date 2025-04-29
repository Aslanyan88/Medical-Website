// app/api/admin/appointments/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

// Get a single appointment
export async function GET(request, { params }) {
  try {
    // Check for admin rights or patient ownership
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: true,
        timeSlot: true
      }
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
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// Update an appointment
export async function PUT(request, { params }) {
  try {
    // Check for admin rights or patient ownership
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const data = await request.json();
    
    // Find the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { timeSlot: true }
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
    
    // Handle reschedule (new timeslot)
    let updatedAppointment;
    
    if (data.timeSlotId && data.timeSlotId !== appointment.timeSlotId) {
      // Check if new timeslot exists and is available
      const newTimeSlot = await prisma.timeSlot.findUnique({
        where: { id: data.timeSlotId }
      });
      
      if (!newTimeSlot) {
        return NextResponse.json(
          { error: 'New timeslot not found' },
          { status: 404 }
        );
      }
      
      if (!newTimeSlot.isAvailable) {
        return NextResponse.json(
          { error: 'Selected timeslot is not available' },
          { status: 400 }
        );
      }
      
      // Start a transaction to update appointment and timeslots
      updatedAppointment = await prisma.$transaction(async (tx) => {
        // Update old timeslot to available if it exists
        if (appointment.timeSlotId) {
          await tx.timeSlot.update({
            where: { id: appointment.timeSlotId },
            data: { isAvailable: true }
          });
        }
        
        // Mark new timeslot as unavailable
        await tx.timeSlot.update({
          where: { id: data.timeSlotId },
          data: { isAvailable: false }
        });
        
        // Update appointment with new data
        return tx.appointment.update({
          where: { id },
          data: {
            date: data.date || appointment.date,
            time: newTimeSlot.startTime,
            reason: data.reason !== undefined ? data.reason : appointment.reason,
            notes: data.notes !== undefined ? data.notes : appointment.notes,
            status: data.status || appointment.status,
            timeSlotId: data.timeSlotId
          },
          include: {
            doctor: true,
            patient: true,
            timeSlot: true
          }
        });
      });
    } else {
      // Just update appointment details without changing timeslot
      updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: {
          date: data.date || appointment.date,
          reason: data.reason !== undefined ? data.reason : appointment.reason,
          notes: data.notes !== undefined ? data.notes : appointment.notes,
          status: data.status || appointment.status
        },
        include: {
          doctor: true,
          patient: true,
          timeSlot: true
        }
      });
    }
    
    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// Delete an appointment
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
    
    // Start a transaction to delete appointment and update timeslot
    await prisma.$transaction(async (tx) => {
      // Delete the appointment
      await tx.appointment.delete({
        where: { id }
      });
      
      // If there was a timeslot, mark it as available again
      if (appointment.timeSlotId) {
        await tx.timeSlot.update({
          where: { id: appointment.timeSlotId },
          data: { isAvailable: true }
        });
      }
    });
    
    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}