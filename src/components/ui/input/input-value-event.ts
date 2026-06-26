export function dispatchInputValueChange(input: HTMLInputElement, value: string) {
    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

    if (valueSetter) {
        valueSetter.call(input, value);
    } else {
        input.value = value;
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
}
