import { Colors } from "@/utils/colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}
const ColorPicker = ({ value, onChange, disabled = false }: Props) => {
  return (
    <Select disabled={disabled} value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Color" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(Colors)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([color, palette]) => {
            return (
              <SelectItem key={color} value={color}>
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: palette.primary }}
                />
                {color}
              </SelectItem>
            );
          })}
      </SelectContent>
    </Select>
  );
};

export default ColorPicker;
