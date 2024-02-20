function wrapString(value: string, wrap: string) {
  return wrap + value + wrap;
}

function wrapValue(value: string) {
  return wrapString(value, '`');
}

function messageReportBuilder(prop: string, logicalExample: string[]) {
  const logicalProps = logicalExample.map(wrapValue).join(', ');

  return `Физические значения свойства ${wrapValue(prop)} запрещены. Используйте логические свойства(${logicalProps})`;
}

export function messageReportSimple(prop: string) {
  const logicalProps = ['-block', '-inline'].map(suffix => prop + suffix);

  return messageReportBuilder(prop, logicalProps);
}

export function messageReportBorder(prop: string) {
  const logicalProps = ['-block-', '-inline-'].map(suffix => prop.replace('-', suffix));

  return messageReportBuilder(prop, logicalProps);
}

export function messageReportBorderRadius(prop: string) {
  const logicalProps = ['-start-start-', '-start-end-', '-end-end-', '-end-start-'].map(suffix =>
    prop.replace('-', suffix)
  );

  return messageReportBuilder(prop, logicalProps);
}
