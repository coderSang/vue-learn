const input  = '(add 2 (subtract 4 2))';
const output = 'add(2, subtract(4, 2))';
const tokens = [
  { type: 'paren', value: '(' },
  { type: 'name', value: 'add' },
  { type: 'number', value: '2' },
  { type: 'paren', value: '(' },
  { type: 'name', value: 'subtract' },
  { type: 'number', value: '4' },
  { type: 'number', value: '2' },
  { type: 'paren', value: ')' },
  { type: 'paren', value: ')' }
]
const ast = {
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2'
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4'
      }, {
        type: 'NumberLiteral',
        value: '2'
      }]
    }]
  }]
};
const newAst = {
  type: 'Program',
  body: [{
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'add'
      },
      arguments: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'subtract'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }
  }]
};
// 分词器，词法分析
// (add "23" (subtract 4 2)) =========>
// [
//   { type: 'paren', value: '(' },
//   { type: 'name', value: 'add' },
//   { type: 'number', value: '2' },
//   { type: 'paren', value: '(' },
//   { type: 'name', value: 'subtract' },
//   { type: 'number', value: '4' },
//   { type: 'number', value: '2' },
//   { type: 'paren', value: ')' },
//   { type: 'paren', value: ')' }
// ]
function tokenizer(input) {
  // 一共有（、 )、number、 string、 空白符 五种
  // 空白符可以直接出去，其他四种按照以下方法存入
  let current = 0
  // 分词
  const tokens = []
  // 保证所有数据都循环完
  while (current < input.length) {
    let char = input[current]
    // （）这两个直接存入到数组
    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '('
      })
      current ++
      continue
    }
    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')'
      })
      current ++
      continue
    }
    let NUMBERS = /[0-9]/
    // 数字经过while直到下一位非数组
    if (NUMBERS.test(char)) {
      let value = ''
      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }
      ++current
      tokens.push({
        type: 'number',
        value
      })
      continue
    }
    let WHITESPACE = /\s/
    // 空白符直接略过
    if (WHITESPACE.test(char)) {
      current ++
      continue
    }
    let LETTERS = /[a-z]/i
    // 方法的字符串 while到下一个非字符
    if (LETTERS.test(char)) {
      let value = ''
      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }
      current++
      tokens.push({
        type: 'name',
        value
      })
      continue
    }
    // 字符串直接找到下一个结束符号"
    if (char === '"') {
      let value = ''
      char = input[++current]
      while (char !== '"') {
        value += char
        char = input[++current]
      }
      current++
      tokens.push({
        type: 'string',
        value
      })
      continue
    }
    // 返回报错
    throw new TypeError('unknown type' + char)
  }
  return tokens
}
// 将token重新解析为AST（抽象语法树）
function parser(tokens) {
  let current = 0
  let ast = {  // 抽象语法树
    type: 'Program',
    body: [], // 存放转换后的语法
  }
  // 递归， 所有的一律按照 (method param1 param2)  param可能为 (method param3 param4)
  function walk() {
    // 递归返回例如（add 2（sub 2 3)) (add 2 3)，AST的节点都为方法，不存在单独的数字或者字符串
    let token = tokens[current];
    // 数字直接返回节点，current后移
    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }
    // 字符串直接返回节点，current后移
    if (token.type === 'string') {
      current++;
      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }
    // （出现的时候代表这进入了一个方法，需要把该方法以节点形式返回，并且将参数保存在该节点内
    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];     // (我们不需要保存到ast数中，后移一位
      let node = {  // 创建方法节点
        type: 'CallExpression',
        name: token.value,
        params: [],
      }; // 为(后面的表达式创建node
      token = tokens[++current];
      while (
        (token.type !== 'paren') ||  // 还没找到后括号的时候或者又进入了内部的方法
        (token.type === 'paren' && token.value !== ')')
        ) {
        node.params.push(walk())  // 递归接收内部方法返回的节点或者自身的参数
        token = tokens[current]; // 循环保证所有参数都走完
      }
      current++;
      return node; // 返回方法的节点
    }
    throw new TypeError(token.type);
  }
  // 开始递归压入节点, while是因为(add 2 2) (sub 2 0)这种，保证能走完。
  // walk执行一次完成一个(method param1 param2)
  while (current < tokens.length) {
    ast.body.push(walk())
  }
  return ast
}
// 改写，把ast转换成另一个新的ast
function traverser(ast, visitor) {
  // 从根节点开始
  traverseNode(ast, null)
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node, parent){
    let methods = visitor[node.type]
    if (methods && methods.enter) { // 有enter函数，则执行， 把node挂载到parent上
      methods.enter(node, parent);
    }
    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node)
        break;
      case 'CallExpression':
        traverseArray(node.params, node)
        break;
      case 'NumberLiteral':
      case 'StringLiteral':
        break;
      default:
        throw new TypeError(node.type);
    }
  }
}
function transformer(ast) {
  // 新的抽象语法树结构
  const newAst = {
    type: "Program",
    body: []
  }
  // 把老的ast_content指向新ast的body，方便赋值
  ast._content = newAst.body
  traverser(ast, {
    // 转换,不同的类型需要不同的转换方法
    // 用一个访问器来访问不同类型的节点，做出不同的操作
    // 一共有四类节点，Program，CallExpression， NumberLiteral， StringLiteral
    //  我们需要把节点和其父节点一起传入，这样才能把子节点挂载到父节点上
    // StringLiteral， NumberLiteral，在访问时直接返回就行
    // CallExpression在访问时要创建新的复合newAst格式的节点
    // type: 'CallExpression',
    // callee: {
    //   type: 'Identifier',
    //   name: node.name,
    // },
    // arguments: [],
    // arguments接收参数param1,param2的
    NumberLiteral: {
      enter(node, parent) {
        parent._content.push({
          type: 'NumberLiteral',
          value: node.value,
          }
        )
      }
    },
    StringLiteral: {
      enter(node, parent) {
        parent._content.push({
            type: 'StringLiteral',
            value: node.value,
          }
        )
      }
    },
    // 方法节点，要进行遍历
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };
        // 本节点的内容，还需要进一步解析
        node._content = expression.arguments
        // 父节点不是函数，那就是Program，是入口，就在外面再包一层
        if (parent.type !== 'CallExpression') {
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }
        // 父组件的内容为expression
        parent._content.push(expression)
      }
    }
  })
  return newAst
}
// 代码生成
function codeGenerator(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGenerator).join('\n');
    case 'ExpressionStatement':
      return codeGenerator(node.expression)+';'
    case 'CallExpression':
      return (
        codeGenerator(node.callee) +
        '(' +
        node.arguments.map(codeGenerator)
          .join(', ') +
        ')'
      );
    case 'Identifier':
      return node.name;
    case 'NumberLiteral':
      return node.value;
    case 'StringLiteral':
      return '"' + node.value + '"';
    default:
      throw new TypeError(node.type);
  }
}


function compiler(input) {
  let tokens = tokenizer(input);
  let ast    = parser(tokens);
  let newAst = transformer(ast);
  return codeGenerator(newAst);
}

module.exports = {
  compiler
}
console.log(parser(tokens))
