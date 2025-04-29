// app/api/admin/doctors/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

// Get a single doctor
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const doctor = await prisma.doctor.findUnique({
      where: { id }
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
    
    const { id } = params;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.specialty || !data.department) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }
    
    // Check if email belongs to another doctor
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: data.email }
    });
    
    if (existingDoctor && existingDoctor.id !== id) {
      return NextResponse.json(
        { error: 'Another doctor with this email already exists' },
        { status: 400 }
      );
    }
    
    // Update doctor
    const doctor = await prisma.doctor.update({
      where: { id },
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
      { error: 'Failed to update doctor' },
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
    
    const { id } = params;
    
    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id }
    });
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Delete doctor (cascade will handle related records)
    await prisma.doctor.delete({
      where: { id }
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