import { useStates } from "@/hooks/state/useState";
import { Tune } from "@/icons/Tune";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Radio,
  RadioGroup,
} from "@nextui-org/react";

interface DropDownFilterProps {
  onStateChange: (stateId: number | null) => void;
  selectedState: number | null;
}

export function DropDownFilter({
  onStateChange,
  selectedState = null,
}: DropDownFilterProps) {
  const { state } = useStates();

  const handleValueChange = (selectedValue: string) => {
    // Si se selecciona "Todos", se pasa null
    if (selectedValue === "todos") {
      onStateChange(null);
    }
    // Si se selecciona un estado, se pasa el ID
    else {
      onStateChange(parseInt(selectedValue));
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          aria-label="Filtrar por estados"
          startContent={<Tune />}
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          Filtrar
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="faded"
        aria-label="Lista de estados para filtrar"
        closeOnSelect={false}
      >
        <DropdownSection
          title="Estados"
          aria-label="Sección de estados"
          showDivider
        >
          <DropdownItem textValue="Estados">
            <RadioGroup
              aria-label="Seleccionar estado"
              value={selectedState?.toString() || "todos"}
              onValueChange={handleValueChange}
            >
              <Radio
                key="todos"
                value="todos"
                aria-label="Mostrar todos los estados"
              >
                Todos
              </Radio>
              {state?.map((item) => (
                <Radio
                  key={item.id}
                  value={item.id.toString()}
                  aria-label={item.name}
                >
                  {item.name}
                </Radio>
              ))}
            </RadioGroup>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
