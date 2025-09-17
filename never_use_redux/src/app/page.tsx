import ReduxPageLayout from './redux/layout'
import ReduxPage from './redux/page'
import ContextPageLayout from './context/layout'
import ContextPage from './context/page'
import ContextCartLayout from './context/cart/layout'
import ContextCartPage from './context/cart/page'
import ContextTodoListLayout from './context/todoList/layout'
import ContextTodoListPage from './context/todoList/page'

function HomePage() {
  return <>
    Work with context native or redux<br></br>
    <br></br><b className="text-blue-700">Redux Page:</b>
    <ReduxPageLayout><ReduxPage></ReduxPage></ReduxPageLayout>
    <br></br><b className="text-blue-700">Context Page:</b>
    <ContextPageLayout><ContextPage></ContextPage></ContextPageLayout>
    <br></br><b className="text-blue-700">Context Cart Page:</b>
    <ContextCartLayout><ContextCartPage></ContextCartPage></ContextCartLayout>
    <br></br><b className="text-blue-700">Context TodoList Page:</b>
    <ContextTodoListLayout><ContextTodoListPage></ContextTodoListPage></ContextTodoListLayout>
  </>
}

export default HomePage;
