import type { Locale } from '@/config/i18n';

interface SectionCopy {
  eyebrow: string;
  title: string;
  sub: string;
}

interface ChromeCopy {
  nav: {
    experience: string;
    education: string;
    stack: string;
    projects: string;
    contact: string;
    switchTheme: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    cta: string;
    statYears: string;
    statSectors: string;
    statProjects: string;
  };
  sections: {
    experience: SectionCopy;
    education: SectionCopy;
    stack: SectionCopy;
    projects: SectionCopy;
    contact: SectionCopy & { cta: string };
  };
  errors: {
    notFoundTitle: string;
    notFoundLead: string;
    unauthorizedTitle: string;
    unauthorizedLead: string;
    backToPortfolio: string;
  };
}

export const COPY: Record<Locale, ChromeCopy> = {
  es: {
    nav: {
      experience: 'Experiencia',
      education: 'Formación',
      stack: 'Stack',
      projects: 'Proyectos',
      contact: 'Contacto',
      switchTheme: 'Cambiar tema',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
    },
    hero: {
      cta: 'Hablemos',
      statYears: 'de experiencia profesional',
      statSectors: 'sectores',
      statProjects: 'proyectos propios en producción',
    },
    sections: {
      experience: {
        eyebrow: 'Trayectoria',
        title: 'Experiencia',
        sub: 'Casi cuatro años entregando producto real en banca, reciclaje, inmobiliario y analítica — de Junior a Ingeniero de Software.',
      },
      education: {
        eyebrow: 'Base académica',
        title: 'Formación',
        sub: 'Tres ciclos formativos que construyeron mi criterio técnico, de la infraestructura al desarrollo de producto.',
      },
      stack: {
        eyebrow: 'Herramientas',
        title: 'Stack & Tecnologías',
        sub: 'El conjunto de tecnologías con las que trabajo a diario, del frontend al despliegue.',
      },
      projects: {
        eyebrow: 'Trabajo propio',
        title: 'Proyectos',
        sub: 'Ideas que llevo de principio a fin: diseño, desarrollo y despliegue en producción.',
      },
      contact: {
        eyebrow: 'Contacto',
        title: '¿Construimos algo juntos?',
        sub: 'Estoy abierto a nuevas propuestas y colaboraciones. Si tienes un proyecto en mente, hablemos.',
        cta: 'Envíame un correo',
      },
    },
    errors: {
      notFoundTitle: 'Página no encontrada',
      notFoundLead: 'La ruta que intentas visitar no existe o ha sido movida.',
      unauthorizedTitle: 'Esta zona es privada',
      unauthorizedLead: 'Solo el ingeniero (y editores autorizados) pueden acceder al backoffice.',
      backToPortfolio: 'Volver al portfolio',
    },
  },
  en: {
    nav: {
      experience: 'Experience',
      education: 'Education',
      stack: 'Stack',
      projects: 'Projects',
      contact: 'Contact',
      switchTheme: 'Switch theme',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      cta: "Let's talk",
      statYears: 'of professional experience',
      statSectors: 'sectors',
      statProjects: 'live personal projects',
    },
    sections: {
      experience: {
        eyebrow: 'Track record',
        title: 'Experience',
        sub: 'Almost four years shipping real product across banking, recycling, real estate, and analytics — from Junior to Software Engineer.',
      },
      education: {
        eyebrow: 'Academic base',
        title: 'Education',
        sub: 'Three vocational programs that built my technical judgment, from infrastructure to product development.',
      },
      stack: {
        eyebrow: 'Tools',
        title: 'Stack & Technologies',
        sub: 'The set of technologies I work with day to day, from frontend to deployment.',
      },
      projects: {
        eyebrow: 'Own work',
        title: 'Projects',
        sub: 'Ideas I take end to end: design, development, and production deploys.',
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Shall we build something?',
        sub: "I'm open to new proposals and collaborations. If you have a project in mind, let's talk.",
        cta: 'Send me an email',
      },
    },
    errors: {
      notFoundTitle: 'Page not found',
      notFoundLead: 'The page you tried to visit does not exist or has been moved.',
      unauthorizedTitle: 'This area is private',
      unauthorizedLead: 'Only the engineer (and authorized editors) can access the backoffice.',
      backToPortfolio: 'Back to portfolio',
    },
  },
};
