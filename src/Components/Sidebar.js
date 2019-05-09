import React, {Component} from 'react'
import Material from './Material'
import {Link} from 'react-router-dom'

class Sidebar extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            selected: '',
        }
    }

    componentDidMount()
    {
        if (window.location.pathname)
        {
            const array = window.location.pathname.split('/')
            if (array[1] === 'Categories')
            {
                this.setState({...this.state, selected: 'category'})
            }
            else if (array[1] === 'Events')
            {
                this.setState({...this.state, selected: 'event'})
            }
            else if (array[1] === 'Users')
            {
                this.setState({...this.state, selected: 'user'})
            }
        }
    }

    componentWillReceiveProps(nextProps, nextContext)
    {
        if (window.location.pathname)
        {
            const array = window.location.pathname.split('/')
            if (array[1] === 'Categories')
            {
                this.setState({...this.state, selected: 'category'})
            }
            else if (array[1] === 'Events')
            {
                this.setState({...this.state, selected: 'event'})
            }
            else if (array[1] === 'Users')
            {
                this.setState({...this.state, selected: 'user'})
            }
        }
    }

    select(selected)
    {
        this.setState({...this.state, selected: selected}, () =>
        {
            if (document.body.clientWidth <= 1000 && this.props.sideOpen) this.props.handleSide()
        })
    }

    render()
    {
        return (
            <div className={this.props.sideOpen ? 'side' : 'sideCollapsed'}>
                <Link to='/Categories' className='side-item-link'>
                    <Material backgroundColor='rgba(74, 90, 108,0.6)' className={this.state.selected === 'category' ? 'side-item-selected' : 'side-item'} onClick={() => this.select('category')} content='دستـه‌بندی‌ هـا'/>
                </Link>
                <Link to='/Events' className='side-item-link'>
                    <Material backgroundColor='rgba(74, 90, 108,0.6)' className={this.state.selected === 'event' ? 'side-item-selected' : 'side-item'} onClick={() => this.select('event')} content='رویـــــداد هـا'/>
                </Link>
                <Link to='/Users' className='side-item-link'>
                    <Material backgroundColor='rgba(74, 90, 108,0.6)' className={this.state.selected === 'user' ? 'side-item-selected' : 'side-item'} onClick={() => this.select('user')} content="کـــاربـــر هـا"/>
                </Link>
            </div>
        )
    }
}

export default Sidebar