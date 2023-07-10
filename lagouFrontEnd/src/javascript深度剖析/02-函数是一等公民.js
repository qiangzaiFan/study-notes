// 把函数赋值给变量
let fn = function () {
  console.log(Hello First-class Function);
};
fu();

// 一个示例

const BlogController = {
  index(posts){return Views.index(posts)},
  show(post){return Views.show(post)},
  create(attrs){return Db.create(attrs)},
  update(post,attrs){return Db.update(post,attrs)},
  destroy(post){return Db.destroy(post)},
}

// 优化
// 一个函数包裹另一个函数，并且它的形式也相同的时候，可以优化，就是正常的简写
const BlogController = {
  index:Views.index,
  show:Views.show,
  create:Db.create,
  update:Db.update,
  destroy:Db.destroy,
}
