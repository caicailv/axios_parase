url与uri
uri是描述某一资源独一无二的标识,通过该标识能找到且只能找到一个该资源

url是uri的一种, url是uri的子集 url是uri的一种具体实现


    1. 如果拦截器是异步,能否生效? 生效 等待异步操作后,再进行发请求
    2. lib/core/Axios.js中92行 while中是否实现了异步执行? 没实现,只是实现了按照顺序去触发chain队列中的函数
    3. 是否可以不传入error拦截? 可以 不传入时框架会把error默认赋值为undifined
    4. 请求拦截器的error函数何时会被执行? 还没找到