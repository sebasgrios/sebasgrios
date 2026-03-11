import type { ExperienceEntry } from '@/types/content';

export const EXPERIENCES: ExperienceEntry[] = [
  {
    title: 'Frontend developer',
    organization: 'SearchIT',
    date: {
      month: 10,
      year: 2025
    },
    kind: 'job',
    isActive: true,
    summary: 'Desarrollando y manteniendo una aplicación web y mobile para el sector bancario.',
    highlights: [
      'Aplicación web desarrollada con React 18.0.',
      'Evolutivo y mantenimiento del Core de la aplicación.',
      'Encargado de los despliegues.',
      'Uso de la metodología CI/CD.'
    ]
  },
  {
    title: 'Fullstack developer',
    organization: 'NTT DATA',
    date: {
      month: 2,
      year: 2025
    },
    kind: 'job',
    summary: 'Desarrollando y manteniendo una aplicación web y mobile para el sector ambiental.',
    highlights: [
      'Aplicación web desarrollada con React 16.0.',
      'Aplicación móvil desarrollada con React Native 0.74.',
      'Backend desarrollado con Moleculer 0.14 y MongoDB.',
      'Encargado de los despliegues.',
      'Uso de la metodología SCRUM.'
    ]
  },
  {
    title: 'Frontend developer',
    organization: 'NTT DATA',
    date: {
      month: 1,
      year: 2024
    },
    kind: 'job',
    summary: 'Desarrollando una aplicación web para el sector financiero.',
    highlights: [
      'Desarrollado con React 16.0.',
      'Gestión de contextos mediante Redux.',
      'Cobertura en tests unitarios de >90%.',
      'Encargado de toda la parte Front del proyecto.',
      'Encargado del UI/UX.',
      'Uso de la metodología CI/CD.'
    ]
  },
  {
    title: 'Frontend junior',
    organization: 'NTT DATA',
    date: {
      month: 7,
      year: 2022
    },
    kind: 'job',
    summary: 'Desarrollando y manteniendo una aplicación web (PWA) para el sector inmobiliario.',
    highlights: [
      'Desarrollado con React 16.0.',
      'Sincronización de datos mediante bases de datos locales y remotas.',
      'Cobertura en tests unitarios de >80%.',
      'Uso de la metodología CI/CD.'
    ]
  },
  {
    title: 'Desarrollo de Aplicaciones Webs',
    organization: 'IES Campanillas',
    date: {
      month: 9,
      year: 2021
    },
    kind: 'education',
    highlights: [
      'Aprendizaje sobre JavaScript.',
      'Creación de aplicaciones webs con PHP.',
      'Manejo de Amazon Web Service.',
      'Maquetación y diseño web.',
      'Programación secuencial.'
    ]
  },
  {
    title: 'Desarrollo de Aplicaciones Multiplataformas',
    organization: 'IES Pablo Picasso',
    date: {
      month: 9,
      year: 2019
    },
    kind: 'education',
    highlights: [
      'Aprendizaje sobre C#.',
      'Creación de aplicaciones de escritorio con Java.',
      'Creación de bases de datos relacionales.',
      'Encriptación de datos.',
      'Programación Orientadas a Objetos.'
    ]
  },
  {
    title: 'Sistemas Microinformáticos y Redes',
    organization: 'IES Juan de la Cierva',
    date: {
      month: 9,
      year: 2017
    },
    kind: 'education',
    highlights: [
      'Configuración de equipos informáticos.',
      'Configuración de redes públicas y privadas.',
      'Configuración de servidores.',
      'Configuración de servicios daemon.',
      'Manejo de herramientas ofimáticas.',
      'Montaje y desmontaje de equipos informáticos.'
    ]
  }
];
