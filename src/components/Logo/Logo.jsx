import logoSrc from '../../assets/logo/chai-swad-logo.jpg'

export default function Logo({ className = 'h-12 w-auto max-w-[13rem] sm:max-w-[18rem] md:h-14 md:max-w-[22rem]' }) {
  return (
    <img
      src={logoSrc}
      alt="Chai Swad"
      className={`object-contain ${className}`}
    />
  )
}
