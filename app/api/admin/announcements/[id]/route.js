// Admin Announcement Detail API Route
// Handles single announcement: GET, PUT, DELETE

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

// GET - Get single announcement
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Authenticate
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'ADMIN_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Check admin role
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin only.', code: 'ADMIN_403' },
        { status: 403 }
      );
    }

    // Get announcement
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        priority: true,
        status: true,
        startsAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found', code: 'ADMIN_404' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { announcement }
    });

  } catch (error) {
    console.error('Get announcement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcement', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}

// PUT - Update announcement
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    // Authenticate
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'ADMIN_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Check admin role
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin only.', code: 'ADMIN_403' },
        { status: 403 }
      );
    }

    // Check announcement exists
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found', code: 'ADMIN_404' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, type, priority, status, startsAt, expiresAt } = body;

    // Build update data
    const updateData = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    if (type !== undefined) {
      const validTypes = ['GENERAL', 'URGENT', 'MAINTENANCE', 'LEGAL', 'POLICY'];
      if (!validTypes.includes(type.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: 'Invalid announcement type', code: 'ADMIN_400' },
          { status: 400 }
        );
      }
      updateData.type = type.toUpperCase();
    }

    if (priority !== undefined) {
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      if (!validPriorities.includes(priority.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: 'Invalid priority level', code: 'ADMIN_400' },
          { status: 400 }
        );
      }
      updateData.priority = priority.toUpperCase();
    }

    if (status !== undefined) {
      const validStatuses = ['ACTIVE', 'INACTIVE', 'DRAFT', 'ARCHIVED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: 'Invalid status', code: 'ADMIN_400' },
          { status: 400 }
        );
      }
      updateData.status = status.toUpperCase();
    }

    if (startsAt !== undefined) {
      const startDate = new Date(startsAt);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid start date', code: 'ADMIN_400' },
          { status: 400 }
        );
      }
      updateData.startsAt = startDate;
    }

    if (expiresAt !== undefined) {
      if (expiresAt === null) {
        updateData.expiresAt = null;
      } else {
        const expiryDate = new Date(expiresAt);
        if (isNaN(expiryDate.getTime())) {
          return NextResponse.json(
            { success: false, error: 'Invalid expiry date', code: 'ADMIN_400' },
            { status: 400 }
          );
        }
        updateData.expiresAt = expiryDate;
      }
    }

    // Update announcement
    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        priority: true,
        status: true,
        startsAt: true,
        expiresAt: true,
        updatedAt: true,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'ADMIN_ANNOUNCEMENT_UPDATE',
        category: 'ADMIN',
        resource: 'announcement',
        resourceId: id,
        metadata: JSON.stringify({
          updatedFields: Object.keys(updateData).filter(k => k !== 'updatedAt'),
          timestamp: new Date().toISOString()
        }),
        severity: 'INFO'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Announcement updated successfully',
      data: { announcement }
    });

  } catch (error) {
    console.error('Update announcement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update announcement', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}

// DELETE - Delete announcement
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Authenticate
    const token = request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'ADMIN_401' },
        { status: 401 }
      );
    }

    const { payload } = await verifyToken(token);

    // Check admin role
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin only.', code: 'ADMIN_403' },
        { status: 403 }
      );
    }

    // Check announcement exists
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
      select: { id: true, title: true }
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found', code: 'ADMIN_404' },
        { status: 404 }
      );
    }

    // Delete announcement
    await prisma.announcement.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: payload.id,
        action: 'ADMIN_ANNOUNCEMENT_DELETE',
        category: 'ADMIN',
        resource: 'announcement',
        resourceId: id,
        metadata: JSON.stringify({
          title: existingAnnouncement.title,
          timestamp: new Date().toISOString()
        }),
        severity: 'WARN'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    });

  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete announcement', code: 'ADMIN_500' },
      { status: 500 }
    );
  }
}
