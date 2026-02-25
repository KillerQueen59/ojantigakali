import type { PortfolioData } from '@/types/portfolio';

const portfolioData: PortfolioData = {
  about: {
    name: 'Muhammad Fauzan Ramadhan',
    title: 'Software Engineer · Full-Stack',
    bio: 'Software Engineer with 4+ years of experience building robust backend systems and full-stack applications. Currently at Arta Intra Teknologi, where I architect fund disbursement services handling high-volume transactions across multiple payment providers. Passionate about end to end finance or complex infrastructure, clean architecture, and scalable distributed systems.',
    facts: [
      { icon: 'MapPin', key: 'Location', value: 'Bogor, Indonesia' },
      {
        icon: 'Globe',
        key: 'Languages',
        value: 'Indonesian (Native), English (Proficient)',
      },
      {
        icon: 'Zap',
        key: 'Interests',
        value:
          'Software Development ( Frontend and Backend), Web Development, Mobile Development, Odoo ERP Module Customization, Geospatial Systems ',
      },
      {
        icon: 'Code',
        key: 'Tools & Technologies',
        value:
          'Java, Go, ReactJS, Next.js, TypeScript, TailwindCSS, PostgreSQL, Redis, RabbitMQ, ElasticSearch, Python ( Odoo )',
      },
      {
        icon: 'Coffee',
        key: 'Hobbies',
        value: 'Traveling, Cooking, Football, Flag Football',
      },
    ],
  },

  experiences: [
    {
      role: 'Software Engineer — Disbursement Team',
      company:
        'OY! Indonesia (PT Dompet Harapan Bangsa) / Arta Intra Teknologi',
      period: 'Feb 2022 – Present',
      location: 'Jakarta, Indonesia',
      points: [
        'Architected end-to-end fund disbursement services with multi-vendor routing logic and automated failover across multiple payment providers.',
        'Enhanced bulk disbursement throughput by 75% by re-engineering CSV workflows into concurrent batch processing with parallel vendor routing.',
        'Designed a flexible pricing engine supporting Volume-based, Merchant Discount Rate, and Frequency-based models, dynamically calculating admin fees across clients.',
        'Built International Remittance API supporting cross-border transactions (SG, MY, PH) with real-time currency conversion and compliance checks.',
        'Optimized database performance via query optimization and binary flag implementations, reducing query processing times by 40%.',
        'Handled 20+ production on-call shifts resolving 350+ incidents; improved acknowledge time by 85%  and resolve time by 73%  year-over-year, maintaining a 99%+ non-escalation issues rate in 2025.',
        'Designed and published a reusable UI component library to Storybook, adopted by 3 teams to accelerate development.',
        'Mentored an engineer through onboarding and collaborated with 20+ engineers across multiple teams.',
      ],
    },
    {
      role: 'Android Engineer',
      company: 'Agree Indonesia',
      period: 'Nov 2021 – Jul 2022',
      location: 'Jakarta, Indonesia',
      points: [
        'Developed SuperAgree mobile app from scratch using Kotlin with multi-module architecture and clean architecture patterns.',
        'Integrated REST APIs using Kotlin and Koin for dependency injection, improving code modularity.',
        "Optimized app performance by refactoring complex functions and reducing dependency overhead through Koin's lazy injection.",
      ],
    },
    {
      role: 'Android Developer',
      company: 'PT Jari Solusi International',
      period: 'Aug 2021 – Nov 2021',
      location: 'Jakarta, Indonesia',
      points: [
        'Developed Android UI for JARI and Jarivis applications using Java and Kotlin.',
        'Implemented real-time geolocation features to track and display user current location.',
      ],
    },
  ],

  projects: [
    {
      name: 'Serat Kalam',
      type: 'Full-stack',
      icon: '/serat-kalam/Logo.png',
      url: 'https://www.seratkalam.com/',
      location: 'Indonesia',
      countryCode: 'ID',
      desc: 'PT. Serat Kalam Media was established with the primary goal of developing and disseminating Quranic literacy through Premium Written Qurans.',
      stack: ['Go', 'SvelteKit', 'PostgreSQL', 'Docker', 'Doku', 'Biteship'],
      highlights: [
        'Built the entire CMS using SvelteKit, covering content management for products, orders, and editorial assets',
        'Developed all backend REST APIs in Go, handling authentication, product catalog, order management, and shipping workflows',
        'Contributed to e-commerce frontend design and resolved UI/UX bugs on the SvelteKit-based storefront',
        'Integrated Doku payment gateway for checkout, payment verification, and transaction status handling',
        'Integrated Biteship API for real-time shipping rate calculation and shipment tracking',
      ],
      images: [
        '/serat-kalam/0.png',
        '/serat-kalam/1.png',
        '/serat-kalam/2.png',
        '/serat-kalam/3.png',
        '/serat-kalam/4.png',
        '/serat-kalam/5.png',
      ],
    },
    {
      name: 'Unops - Simelaproklim',
      type: 'Frontend',
      icon: '/simelaproklim/Logo.png',
      url: 'https://www.simelaproklim.org/',
      location: 'Indonesia',
      countryCode: 'ID',
      desc: 'We locally driven climate action by strengthening the capacity of rural communities to adapt on climate change and sustainably manage natural resources. PROKLIM Project stands for Strengthening Village-Based Climate Action and Livelihoods (PROKLIM) in South Sumatra Province, Indonesia engages 100 target villages across 10 regencies to promote climate resilience, sustainable livelihoods, and environmental protection. Here are the regencies for our efforts, Ogan Ilir, Penukal Abab Lematang Ilir, Musi Rawas, Musi Rawas Utara, Banyuasin, Musi Banyuasin, Ogan Komering Ulu Timur, Ogan Komering Ilir, Empat Lawang and Prabumulih City.',
      stack: ['Next.js', 'Map GIS Integration', 'Leaflet'],
      highlights: [
        'Built the CMS using Next.js to manage climate action data across 100 target villages in South Sumatra',
        'Implemented bulk data upload via CSV, enabling admins to efficiently input and update village-level records at scale',
        'Developed GeoJSON-to-Map upload flow, allowing admins to import geospatial boundaries directly into the interactive map view',
        'Supported data management across 10 regencies, covering village profiles, climate indicators, and livelihood metrics',
      ],
      images: [
        '/simelaproklim/0.png',
        '/simelaproklim/1.png',
        '/simelaproklim/2.png',
        '/simelaproklim/3.png',
      ],
    },
    {
      name: 'Fokuslah',
      type: 'Full-stack',
      icon: 'BookOpen',
      url: 'https://www.fokuslah.com/',
      location: 'Malaysia',
      countryCode: 'MY',
      desc: 'Quiz platform for Malaysian SPM students with AI-powered explanations, personalized weakness analysis, and subscription payment support.',
      stack: ['Go', 'Next.js', 'Razorpay', 'PostHog'],
      highlights: [
        'Architected backend API with Go and frontend with Next.js, handling full product lifecycle',
        'Built quiz scoring engine that identifies knowledge gaps and generates personalized weakness reports',
        'Implemented Razorpay for both one-time payment links and subscription-based access with webhook handling',
        'Integrated PostHog for behavioral analytics and quiz completion rate monitoring',
      ],
      images: [
        '/fokuslah/0.png',
        '/fokuslah/1.png',
        '/fokuslah/2.png',
        '/fokuslah/3.png',
      ],
    },
    {
      name: 'Data Desa Presisi',
      type: 'Frontend ( Web & Mobile )',
      icon: 'Map',
      url: 'https://webgis.desapresisi.id',
      location: 'Indonesia',
      countryCode: 'ID',
      desc: 'Three Next.js apps (Census, Monev, WebGIS) for village data collection, monitoring, and geospatial visualization across Indonesia.',
      stack: ['Next.js', 'TailwindCSS', 'GraphQL', 'Leaflet', 'Map GIS Integration'],
      highlights: [
        'Developed Census, Monev, and WebGIS applications for village data across Indonesia',
        'Built Monev dashboard for real-time census oversight with data export functionality',
        'Developed WebGIS with Leaflet for interactive maps and multi-polygon drill-down from province to village',
        'Integrated GraphQL APIs across all three platforms for efficient data fetching',
      ],
      images: [
        '/data-desa-presisi/0.png',
        '/data-desa-presisi/1.png',
        '/data-desa-presisi/2.png',
        '/data-desa-presisi/3.png',
        '/data-desa-presisi/4.png',
        '/data-desa-presisi/5.png',
        '/data-desa-presisi/6.png',
      ],
    },
    {
      name: 'Jakarta Garden City',
      type: 'Frontend',
      icon: '/jgc/Logo.png',
      url: 'https://jakartagardencity.com/id',
      location: 'Indonesia',
      countryCode: 'ID',
      desc: 'Official marketing website for Jakarta Garden City — a 370-hectare integrated township in East Jakarta combining residential, commercial, and lifestyle amenities. The site serves as a digital hub for prospective residents and investors to explore properties, facilities, and promotions.',
      stack: ['Next.js', 'TailwindCSS', 'SWR'],
      highlights: [
        'Developed the public-facing marketing website for a large-scale township with 40+ facilities and multiple residential clusters',
        'Built property listing pages covering landed houses, apartments, and commercial units with dynamic filtering',
        'Implemented promotions and news sections with SWR for efficient data fetching and revalidation',
        'Integrated virtual tour and WhatsApp contact features to drive lead conversion for the sales team',
      ],
      images: ['/jgc/0.png', '/jgc/1.png', '/jgc/2.png', '/jgc/3.png'],
    },
    {
      name: 'Parkle',
      type: 'Full-stack',
      icon: '/parkle/Logo.png',
      url: '#',
      location: 'Germany',
      countryCode: 'DE',
      desc: 'Parking booking application for users in Frankfurt, Germany — real-time availability, license plate verification, and Stripe payments.',
      stack: ['React Native', 'Stripe', 'Google Maps API', 'NestJS', 'PostgreSQL', 'AWS', 'Redis'],
      highlights: [
        'Developed backend API using NestJS framework, serving parking spot reservations for Frankfurt users',
        'Implemented Stripe payment gateway handling authorization, capture, and refund workflows',
        'Built RESTful endpoints for booking management, license plate verification, and real-time availability',
      ],
      images: [
        '/parkle/0.png',
        '/parkle/1.png',
        '/parkle/2.png',
        '/parkle/3.png',
        '/parkle/4.png',
      ],
    },
  ],

  education: {
    education: [
      {
        degree: 'Bachelor of Computer Science',
        school: 'Institut Pertanian Bogor (IPB)',
        period: 'Aug 2018 – Jul 2022',
        location: 'Bogor, Indonesia',
        gpa: '3.78 / 4.00',
        highlights: [
          'Computer Lab Assistant for Software Engineering & Information System courses',
          'Organizations: Mobile Apps Development Community, Himalkom IPB, Flag Football IPB',
        ],
      },
      {
        degree: 'Mobile Programming (Android) Learning Path',
        school: 'Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka',
        period: 'Jan 2021 – Jul 2021',
        location: 'Indonesia',
        highlights: [
          'Intensive 7-month program focused on Android development, machine learning, and cloud computing',
          'Completed hands-on projects covering Kotlin, Android Jetpack, REST APIs, and Google Cloud Platform',
        ],
      },
    ],
    achievements: [
      {
        name: '1st Winner — SUCOFINDO Science Hackathon Innovation Festival',
        year: '2025',
        org: 'FloodGuard.ID · IoT & GIS-based flood protection and watershed rehabilitation',
        desc: 'IoT & GIS flood protection system integrating automatic weather stations and water level recorders for real-time disaster monitoring across Indonesian watersheds.',
        stack: ['IoT', 'GIS', 'Arduino'],
        highlights: [
          "Won 1st place at SUCOFINDO's Science Hackathon Innovation Festival 2025",
          'Integrated automatic weather stations and water level recorders for real-time watershed data',
          'Built GIS visualization layer mapping flood risk zones across Indonesian watersheds',
        ],
      },
      {
        name: '1st Winner — SUCOFINDO Science Hackathon Innovation Festival',
        year: '2024',
        org: 'PeatWatch.ID · IoT & GIS intelligent system for Indonesian peatland monitoring',
        desc: 'Intelligent monitoring system for Indonesian peatlands, preventing forest fires through real-time environmental data collection and GIS-integrated risk visualization.',
        stack: ['IoT', 'GIS', 'Arduino'],
        highlights: [
          "Won 1st place at SUCOFINDO's Science Hackathon Innovation Festival 2024",
          'Designed IoT sensor network for continuous peatland environmental data collection',
          'Built GIS-integrated dashboard visualizing peatland health and fire risk indicators',
        ],
      },
    ],
  },

  contact: {
    email: 'fauzanramadhan59@gmail.com',
    location: 'Bogor, Indonesia',
    github: 'https://github.com/KillerQueen59',
    linkedin: 'https://www.linkedin.com/in/muhammad-fauzan-ramadhan/',
  },

  github: {
    username: '@KillerQueen59',
    url: 'https://github.com/KillerQueen59',
    repos: 43,
    stars: 3,
    followers: 26,
    pinned: [
      {
        name: 'flood-guard',
        desc: 'IoT & GIS flood protection system for real-time disaster monitoring.',
        lang: 'TypeScript',
        stars: 0,
        forks: 0,
        color: '#3178c6',
      },
      {
        name: 'unops-cms',
        desc: 'CMS for UNOPS Simelaproklim — village climate data management with GIS.',
        lang: 'TypeScript',
        stars: 0,
        forks: 0,
        color: '#3178c6',
      },
      {
        name: 'smart-terra',
        desc: 'Smart agriculture monitoring system.',
        lang: 'TypeScript',
        stars: 0,
        forks: 0,
        color: '#3178c6',
      },
      {
        name: 'fauzan-artifacts',
        desc: 'Personal portfolio styled as a macOS desktop environment.',
        lang: 'TypeScript',
        stars: 0,
        forks: 0,
        color: '#3178c6',
      },
    ],
  },

  resume: {
    name: 'Muhammad Fauzan Ramadhan',
    subtitle:
      'Software Engineer · fauzanramadhan59@gmail.com · Bogor, Indonesia',
    summary:
      'Software Engineer with 3+ years of experience building robust backend systems and full-stack applications in fintech. Skilled in Java, Go, NestJS, ReactJS, and NextJS. 2× Hackathon Champion (SUCOFINDO 2024 & 2025).',
    experiences: [
      {
        role: 'Software Engineer',
        company: 'OY! Indonesia',
        period: 'Aug 2022–Present',
      },
      {
        role: 'Android Engineer',
        company: 'Agree Indonesia',
        period: 'Nov 2021–Jul 2022',
      },
      {
        role: 'Full-stack Engineer',
        company: 'Fokuslah (Freelance)',
        period: '2023',
      },
    ],
    skills:
      'Java · Go · NestJS · ReactJS · Next.js · TypeScript · TailwindCSS · Redux · PostgreSQL · Redis · RabbitMQ · ElasticSearch · REST · GraphQL · Docker · Git · Stripe · Razorpay · Sentry · Kibana',
  },

  links: {
    categories: [
      {
        category: 'Social',
        items: [
          {
            name: 'GitHub',
            url: 'https://github.com/KillerQueen59',
            desc: 'Open-source projects & contributions',
            icon: 'Github',
          },
          {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/muhammad-fauzan-ramadhan/',
            desc: 'Professional network',
            icon: 'Linkedin',
          },
        ],
      },
      {
        category: 'Contact',
        items: [
          {
            name: 'Email',
            url: 'mailto:fauzanramadhan59@gmail.com',
            desc: 'fauzanramadhan59@gmail.com',
            icon: 'Mail',
          },
          {
            name: 'Phone',
            url: 'tel:+6282112542184',
            desc: '+62 821 1254 2184',
            icon: 'Smartphone',
          },
        ],
      },
    ],
  },
};

export default portfolioData;
