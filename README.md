# Portfolio Website

A modern, interactive portfolio website built with React, TypeScript, and Three.js. Features a stunning 3D background animation, smooth transitions, and a fully responsive design.

## 🚀 Features

- **3D Background Animation**: Interactive Three.js torus that responds to mouse movement
- **Dark/Light Mode**: Persistent theme preference with smooth transitions
- **Scroll Animations**: Intersection Observer-based animations for smooth section reveals
- **Skills Proficiency**: Visual progress bars showing skill levels
- **Contact Form**: Functional contact form with validation
- **GitHub Stats**: Showcase of GitHub activity and contributions
- **Fully Responsive**: Optimized for all screen sizes
- **Accessibility**: ARIA labels, keyboard navigation, and focus states
- **SEO Optimized**: Meta tags, Open Graph, and Twitter cards
- **Performance**: Lazy loading, optimized animations, and efficient rendering

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Three.js** - 3D graphics
- **GSAP** - Advanced animations
- **Lucide React** - Icon library

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Abhyshekbhalaji/portfolio-upd.git
cd portfolio-upd
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun dev
```

4. Build for production:
```bash
npm run build
# or
bun build
```

5. Preview production build:
```bash
npm run preview
# or
bun preview
```

## 📁 Project Structure

```
portfolio-upd/
├── src/
│   ├── Portfolio.tsx      # Main portfolio component
│   ├── App.tsx            # App wrapper
│   ├── main.tsx          # Entry point
│   ├── App.css           # Global styles
│   └── index.html        # HTML template
├── public/               # Static assets
├── dist/                 # Build output
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

## 🎨 Customization

### Update Personal Information

Edit the following in `src/Portfolio.tsx`:

- **Hero Section**: Name, title, and description
- **About Section**: Education and key strengths
- **Experience Section**: Work experience and achievements
- **Projects**: Project details, links, and metrics
- **Skills**: Technical skills and proficiency levels
- **Contact**: Email, social links, and location

### Theme Customization

The portfolio supports dark and light themes. Colors can be customized in the component by modifying the `bgClass`, `textClass`, and `cardBg` variables.

### 3D Animation

The Three.js animation can be customized in the `useEffect` hook that sets up the Three.js scene. Modify:
- Torus geometry parameters
- Material colors and properties
- Lighting setup
- Animation speed and rotation

## 🔧 Configuration

### Vite Configuration

The project uses Vite with React plugin and Tailwind CSS. Configuration is in `vite.config.js`.

### TypeScript Configuration

TypeScript is configured with strict mode enabled. See `tsconfig.json` for details.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ♿ Accessibility

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## 🚀 Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### GitHub Pages

1. Install `gh-pages`: `npm install -D gh-pages`
2. Add to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```
3. Run: `npm run deploy`

## 📄 License

ISC

## 👤 Author

**Abhyshek Bhalaji S**

- GitHub: [@Abhyshekbhalaji](https://github.com/Abhyshekbhalaji)
- LinkedIn: [abhyshek-bhalaji-65324b208](https://www.linkedin.com/in/abhyshek-bhalaji-65324b208/)
- Twitter: [@AbhyAtTech](https://x.com/AbhyAtTech)
- Email: abhyshekbhalaji@gmail.com

## 🙏 Acknowledgments

- Three.js for 3D graphics
- GSAP for smooth animations
- Lucide for beautiful icons
- Tailwind CSS for utility-first styling

---

Made with ❤️ using React, TypeScript, and Three.js


