import React, {Component} from 'react'

class Users extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            modal: false,
            phone: ''
        }
    }

    showPhone(phone)
    {
        this.setState({...this.status, phone, modal: true})
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
                    <div className='user-detail-title'>نقش</div>
                    <div className='user-phone-title'>تلفن</div>
                </div>
                {
                    this.props.users.map((user, i) =>
                        <div key={i} className='user-cont'>
                            <div className='user-detail'>{user.username}</div>
                            <div className='user-detail'>{user.name}</div>
                            <div className='user-detail'>{user.type}</div>
                            <div className='user-phone' onClick={this.showPhone.bind(this, user.phone)}><span role='img' aria-label='detail'>📄</span></div>
                        </div>
                    )
                }

                <div className={this.state.modal ? 'modal' : 'modal-hide'} onClick={this.hideModal.bind(this)}/>
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