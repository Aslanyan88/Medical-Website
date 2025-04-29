// app/api/admin/doctors/[doctorId]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

// Get a single doctor
export async function GET(request, { params }) {
  try {
    const { doctorId } = params;
    
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctor' },
      { status: 500 }
    );
  }
}

// Update a doctor
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
    
    const { doctorId } = params;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.specialty || !data.department) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }
    
    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });
    
    if (!existingDoctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Check if email belongs to another doctor
    const emailCheck = await prisma.doctor.findUnique({
      where: { email: data.email }
    });
    
    if (emailCheck && emailCheck.id !== doctorId) {
      return NextResponse.json(
        { error: 'Another doctor with this email already exists' },
        { status: 400 }
      );
    }
    
    // Update doctor
    const doctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        name: data.name,
        nameHy: data.nameHy || null,
        email: data.email,
        specialty: data.specialty,
        specialtyHy: data.specialtyHy || null,
        department: data.department,
        departmentHy: data.departmentHy || null,
        bio: data.bio || null,
        bioHy: data.bioHy || null,
        image: data.image || null,
        experience: data.experience ? parseInt(data.experience) : null,
      }
    });
    
    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update doctor' },
      { status: 500 }
    );
  }
}

// Delete a doctor
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
    
    const { doctorId } = params;
    
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
    
    // Delete doctor
    await prisma.doctor.delete({
      where: { id: doctorId }
    });
    
    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json(
      { error: 'Failed to delete doctor' },
      { status: 500 }
    );
  }
}