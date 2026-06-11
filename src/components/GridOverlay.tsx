export default function GridOverlay({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            rgba(28,28,26,${opacity}) 0px,
            rgba(28,28,26,${opacity}) 1px,
            transparent 1px,
            transparent 60px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(28,28,26,${opacity}) 0px,
            rgba(28,28,26,${opacity}) 1px,
            transparent 1px,
            transparent 60px
          )
        `,
      }}
    />
  )
}
