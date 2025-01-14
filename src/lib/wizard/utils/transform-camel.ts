export const transformToLowerCamelCase = (input: string): string => 
    input.charAt(0).toLowerCase() + input.slice(1);