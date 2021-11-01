import { Box } from "@chakra-ui/layout";
import { useRadio } from "@chakra-ui/radio";

export default function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "#65b5ff",
          color: "white",
          borderColor: "#65b5ff",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={10}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
}
