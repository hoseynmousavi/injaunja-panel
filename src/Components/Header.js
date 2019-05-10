import React, {Component} from 'react'
import hamburger from '../Media/Images/Hamburger.svg'
import Material from './Material'

class Header extends Component
{
    render()
    {
        return (
            <div className='header'>
                <Material backgroundColor={this.props.sideOpen ? 'transparent' : 'rgba(204,204,204,0.8)'} onClick={() => this.props.handleSide()} className={this.props.sideOpen ? 'header-hamburger-cont' : 'header-hamburger-cont-collapse'}>
                    <img src={hamburger} alt='' className='header-hamburger'/>
                </Material>
                <div className='header-title'>پنل <span style={{color: '#FF6C60'}}>مدیریت</span></div>
            </div>
        )
    }
}

export default Header