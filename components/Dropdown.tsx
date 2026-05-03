import { Option } from "../common/types";

type DropdownProps = {
  onChange?: (s: string) => void;
  options: Option[];
  value: string;
};

const Dropdown = ({ onChange, options, value }: DropdownProps) => {
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="dropdown">
      <select className="dropdown-anchor" onChange={handleOptionChange} value={value}>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
