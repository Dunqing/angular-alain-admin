export function getMenus(menuList, callback: (data) => object) {
  function handle(menus) {
    return menus.map((item) => {
      let children = [];
      if (item.children && item.children.length) {
        // if (item.children[0].type !== 1) {
        children = JSON.parse(JSON.stringify(item.children));
        // }
      }
      // console.log(item);
      // Reflect.deleteProperty(item, 'children');
      // console.log(meta?.title, children);
      const result = {
        children: children.length ? handle(children) : null,
        ...callback(item),
      };
      if (!result.children) {
        Reflect.deleteProperty(result, 'children');
      }
      return result;
    });
  }
  return handle(menuList);
}
