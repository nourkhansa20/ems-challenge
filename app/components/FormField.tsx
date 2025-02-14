/**
 * FormField is a reusable and highly customizable form input component.
 * It supports various input types, including text, number, select dropdowns, and textareas.
 * Features include:
 * - Support for text, number, select, and textarea input types.
 * - Customizable labels, error messages, and styling.
 * - Integration with `react-select` for dropdowns.
 * - Required field validation.
 * - Flexible onChange handlers for different input types.
 */
import Select from "react-select";

interface OptionType {
  value: string | number;
  label: string;
}

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  id: string;
  error?: string;
  clasName: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | OptionType) => void;
  required?: boolean;
  step?: string;
  options?: OptionType[]; // Only required for select fields
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  id,
  value,
  clasName,
  onChange,
  required,
  step,
  options,
  error
}) => {
  return (
    <div>
      <div className="flex  items-center">
        <label htmlFor={id} className="mr-3 flex-1 field-label">{label}</label>
        {type === "select" && options ? (
          <Select
            options={options}
            name={name}
            value={options.find(option => option.value === value)}
            onChange={(selectedOption) => onChange(selectedOption as OptionType)}
            className={` flex-1 ${clasName}`}
            styles={{
              control: (provided) => ({
                ...provided,
                border: '1px solid var(--color-gray-300)',
                borderRadius: '7px',
                padding: '2px 5px',
                width: '25ex',
                minHeight: '40px',
                height: '40px',
                fontSize: '0.875rem'
              }),
            }}
          />
        ) :
          type === "textarea" ? (
            <textarea
              name={name}
              id={id}
              value={value}
              onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required={required}
              step={step}
              className={`field flex-3 ${clasName}`}
            />
          )
            : (
              <input
                type={type}
                name={name}
                id={id}
                value={value}
                onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                required={required}
                step={step}
                className={`field flex-1 ${clasName}`}
              />
            )}


      </div>
      {
        error &&
        <div className="text-xs text-red-400 ">{error}</div>
      }
    </div>

  );
};