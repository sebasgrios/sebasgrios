import BastianGR from '@/images/bastiangr.webp';
import ClaraRomero from '@/images/clararomero.webp';
import UnoCien from '@/images/1-100.webp';
import MiLista from '@/images/mi-lista.webp';
import type { ProjectEntry } from '@/types/content';

export const PROJECTS: ProjectEntry[] = [
  {
    title: 'BastianGR',
    description: 'Web personal de un particular.',
    image: BastianGR,
    technologies: ['astro', 'typescript', 'tailwindcss', 'cloudflare'],
    liveUrl: 'https://bastiangr.es',
    codeUrl: 'https://github.com/sebasgrios/bastiangr'
  },
  {
    title: '1-100',
    description: 'Entrena tu concentración, reflejos y agudeza visual.',
    image: UnoCien,
    technologies: ['astro', 'tailwindcss', 'cloudflare'],
    liveUrl: 'https://1-100.pages.dev',
    codeUrl: 'https://github.com/sebasgrios/1-100'
  },
  {
    title: 'Mi lista',
    description: 'Gestiona tu propia lista de manera fácil y sencilla.',
    image: MiLista,
    technologies: ['nextjs', 'typescript', 'redux', 'tailwindcss', 'cloudflare'],
    liveUrl: 'https://mi-lista.es',
    codeUrl: 'https://github.com/sebasgrios/mi-lista'
  },
  {
    title: 'Clara Romero',
    description: 'Web corporativa sobre una peluquería local.',
    image: ClaraRomero,
    technologies: ['wordpress', 'mysql'],
    liveUrl: 'http://clararomero.com'
  }
];
