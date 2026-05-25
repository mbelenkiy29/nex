interface FormErrorProps {
  field?: any;
}

export function FormError({ field }: FormErrorProps) {
  const errors = field?.state?.meta?.errors;

  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <p className="text-sm text-red-500">
      {errors
        .map((error: any) => error?.message)
        .filter(Boolean)
        .join(', ')}
    </p>
  );
}
