import React, {Component} from 'react'
import Material from './Material'
import {NotificationManager} from 'react-notifications'

class Users extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            modal: false,
            phone: '',
        }
        this.hideModal = this.hideModal.bind(this)
    }

    showPhone(phone)
    {
        this.setState({...this.status, phone, modal: true})
    }

    deleteUser(userId, userName)
    {
        setTimeout(() =>
        {
            let submit = window.confirm(`از حذف کاربر ${userName} مطمئن هستید؟!`)
            if (submit)
            {
                this.props.handleLoading(true).then(() =>
                {
                    fetch('http://185.211.58.174:1435/user/delete', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                            'auth': 'QEFiZWxtaXJpIEBIb3NleW5tb3VzYXZp',
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            admin_id: 1,
                        }),
                    })
                        .then((res) => res.json())
                        .then((resJson) =>
                        {
                            if (resJson.state === 1)
                            {
                                this.props.handleLoading(false).then(() =>
                                {
                                    this.props.removeUser(userId)
                                    NotificationManager.info('کاربر با موفقیت حذف شد.')
                                })
                            }
                            else
                            {
                                this.props.handleLoading(false).then(() =>
                                {
                                    NotificationManager.error('خطایی رخ داده است!')
                                })
                            }
                        })
                })
            }
        }, 350)
    }

    hideModal()
    {
        this.setState({...this.status, modal: false})
    }

    render()
    {
        return (
            <div className='users-cont'>
                <div className='user-cont-title'>
                    <div className='user-detail-title'>نام کاربری</div>
                    <div className='user-detail-title'>نام و نام خانوادگی</div>
                    <div className='user-phone-title'>نقش</div>
                    <div className='user-phone-title'>تلفن</div>
                    <div className='user-phone-title'>حذف</div>
                </div>
                {
                    this.props.users.map((user, i) =>
                        <div key={i} className='user-cont'>
                            <div className='user-detail'>{user.username}</div>
                            <div className='user-detail'>{user.name}</div>
                            <div className='user-phone'>{user.type}</div>
                            <div className='user-phone' onClick={this.showPhone.bind(this, user.phone)}><span role='img' aria-label='detail'>📄</span></div>
                            <Material backgroundColor='rgba(255,0,0,0.2)' className='user-delete' onClick={this.deleteUser.bind(this, user.id, user.username)}>Delete</Material>
                        </div>,
                    )
                }

                <div className={this.state.modal ? 'modal' : 'modal-hide'} onClick={this.hideModal}/>
                <div className={this.state.modal ? 'user-modal' : 'user-modal-hide'}>
                    {
                        this.state.phone
                    }
                </div>

            </div>
        )
    }
}

export default Users