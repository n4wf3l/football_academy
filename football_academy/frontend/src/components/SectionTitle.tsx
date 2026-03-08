interface Props {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionTitle({ title, subtitle, light = false }: Props) {
  return (
    <div className="text-center mb-12">
      <h2 className={`text-3xl md:text-4xl font-bold ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg ${light ? 'text-gray-300' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-20 h-1 bg-primary rounded"></div>
    </div>
  );
}
