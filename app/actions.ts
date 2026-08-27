'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { calculatePeriod } from './utils';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  description: z.string(),
  scheduledAt: z.date(),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

export async function createAppointment(data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduledAt } = parsedData;
    const hour = scheduledAt.getHours();

    const { isMorning, isAfternoon, isEvening } = calculatePeriod(hour);

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Agendamentos só podem ser feitos entre 9h e 12h, 13h e 18 ou 19h e 21h',
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduledAt,
      },
    });

    if (existingAppointment) {
      return {
        error: 'Este horário já está reservado',
      };
    }

    await prisma.appointment.create({
      data: {
        ...parsedData,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);
  }
}

export async function updateAppointment(id: string, data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduledAt } = parsedData;
    const hour = scheduledAt.getHours();

    const { isMorning, isAfternoon, isEvening } = calculatePeriod(hour);

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Agendamentos só podem ser feitos entre 9h e 12h, 13h e 18 ou 19h e 21h',
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduledAt,
        id: {
          not: id,
        },
      },
    });

    if (existingAppointment) {
      return {
        error: 'Este horário já está reservado',
      };
    }

    await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        ...parsedData,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);
    return {
      error: 'Ocorreu um erro ao atualizar o agendamento. Tente novamente.',
    };
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: {
        id,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);
    return {
      error: 'Ocorreu um erro ao excluir o agendamento. Tente novamente.',
    };
  }
}
