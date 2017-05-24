import last from 'lodash.last';

export default name => {
  if (name.includes('/')) {
    const newName = name.split('/');
    if (newName.length > 2) {
      return [newName.slice(0, newName.length - 1).join('/'), last(newName)];
    } else {
      return newName;
    }
  } else {
    return [name];
  }
};
