interface InputFieldsInterface {
  fieldId: string;
  fieldName: string;
  fieldDescription?: string;
  fieldType: "string" | "number" | "select" | "radio";
  possibleValues?: { id: string; title: string }[];
  min?: number;
  max?: number;
}

export { InputFieldsInterface };
