import React from 'react'

// redux
import { useSelector, useStore } from 'react-redux';
import { loadPeopleList } from '@actions/people'
import { getPeopleListById } from '@reducers/people'

// components
import PeopleItem from './components/list-item';
// class
import ListClass from '../../class/list';
import './index.scss';

interface Props {
  // 列表id
  id: string;
  // 查询条件
  query: object;
  // 启动滚动加载
  scrollLoad?: boolean;
  // 显示分页
  showPagination?: boolean;
  // 没有数据的时候显示内容
  nothing?: any;
}

export default function(props:Props) {

  const { id } = props;
  const store = useStore();
  const list = useSelector((state: any) => {
    return getPeopleListById(state, id)
  });
  
  return (<ListClass
    {...props}
    {...list}
    load={params=>loadPeopleList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return (<div key={item._id}>
        <PeopleItem people={item} />
      </div>)
    }}
    renderHead={({ loadData }: any)=>{

      if (list.more) {
        return (<div styleName="more">
            <a href="javascript:void(0)" onClick={()=> { loadData(); }}>加载更多</a>
          </div>)
      } else {
        return null
      }

    }}
  />)

}

/*
@connect(
  (state, props) => ({
    peopleList: getPeopleListById(state, props.name)
  }),
  dispatch => ({
    loadPeopleList: bindActionCreators(loadPeopleList, dispatch)
  })
)
export default class PeopleList extends Component{

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.load = this.load.bind(this)
  }

  componentDidMount() {
    const { name, peopleList } = this.props
    if (!peopleList.data) this.load();
    ArriveFooter.add(name, this.load);
  }

  componentWillUnmount() {
    const { name } = this.props;
    ArriveFooter.remove(name);
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      this.props = props
      const { name, filters, loadPeopleList } = props
      loadPeopleList({ name, filters, restart: true })
    }
  }

  load(callback) {
    const { name, filters, loadPeopleList } = this.props
    loadPeopleList({ name: name, filters: filters })
  }

  render () {

    const { peopleList } = this.props;
    const { data, loading, more, count, filters = {} } = peopleList;

    if (!loading && data && data.length == 0 && !more) {
      return <div className="text-center mt-4 md-4">没有查询到结果</div>
    }

    return (<div className="card">

      <div className="list-group">
        {data && data.map(people=>{
          return (<PeopleItem people={people} key={people._id} />)
        })}
      </div>

      {loading ? <Loading /> : null}


    </div>)

  }

}
*/