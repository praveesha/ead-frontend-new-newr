// Allow importing CSS files in TypeScript (Vite + React)
declare module '*.css';
declare module '*.scss';

// Some Swiper subpaths (e.g. 'swiper/modules') may not have TS declarations in certain setups
declare module 'swiper/modules';
