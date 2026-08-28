import { AppointmentPeriod, AppointmentPeriodDay } from '../types/appointment';
import { Appointment as AppointmentType } from '../types/appointment';

type Appointment = {
  id: string;
  petName: string;
  description: string;
  tutorName: string;
  phone: string;
  scheduledAt: Date;
};

export const getPeriod = (hour: number): AppointmentPeriodDay => {
  if (hour >= 9 && hour < 12) {
    return 'morning';
  } else if (hour >= 13 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};

export function groupAppointmentsByPeriod(
  appointments: Appointment[]
): AppointmentPeriod[] {
  const transformedAppointments: AppointmentType[] = appointments?.map(
    (apt) => ({
      ...apt,
      time: formatDateTime(apt.scheduledAt),
      service: apt.description,
      period: getPeriod(parseInt(formatDateTime(apt.scheduledAt))),
    })
  );

  const morningAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'morning'
  );

  const afternoonAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'afternoon'
  );

  const eveningAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'evening'
  );

  return [
    {
      title: 'Manhã',
      type: 'morning',
      typeRange: '09h-12h',
      appointments: morningAppointments,
    },
    {
      title: 'Tarde',
      type: 'afternoon',
      typeRange: '13h-18h',
      appointments: afternoonAppointments,
    },
    {
      title: 'Noite',
      type: 'evening',
      typeRange: '19h-21h',
      appointments: eveningAppointments,
    },
  ];
}

export function calculatePeriod(hour: number) {
  const isMorning = hour >= 9 && hour < 12;
  const isAfternoon = hour >= 13 && hour < 18;
  const isEvening = hour >= 19 && hour < 21;

  return {
    isMorning,
    isAfternoon,
    isEvening,
  };
}

export function formatDateTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  });
}
