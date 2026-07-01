export const strictTransition = {
  type: "tween",
  ease: [0.25, 1, 0.5, 1], 
  duration: 0.2,
};

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: strictTransition
  }
};