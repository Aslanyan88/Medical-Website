// app/api/admin/doctors/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// Get all doctors
export async function GET(request) {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

// Create a new doctor
export async function POST(request) {
  try {
    // Check for admin rights
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.specialty || !data.department) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: data.email }
    });
    
    if (existingDoctor) {
      return NextResponse.json(
        { error: 'Doctor with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create doctor
    const doctor = await prisma.doctor.create({
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
    
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json(
      { error: 'Failed to create doctor' },
      { status: 500 }
    );
  }
}