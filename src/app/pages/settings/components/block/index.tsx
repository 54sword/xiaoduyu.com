import React from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';

export default function() {

    const me = useSelector((state:object)=>getUserInfo(state));
    
    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">屏蔽管理</div>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-4"><Link to="/block/posts">屏蔽{me.block_posts_count}个话题</Link></div>
                    <div className="col-4"><Link to="/block/peoples">屏蔽{me.block_people_count}位用户</Link></div>
                    <div className="col-4"><Link to="/block/comments">屏蔽{me.block_comment_count}条评论</Link></div>
                </div>
            </div>
        </div>
    )
}