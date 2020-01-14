class ParseStringAsArray {
  run(array_as_string) {
    return array_as_string.split(',').map(tech => tech.trim());
  }
}

export default new ParseStringAsArray();
