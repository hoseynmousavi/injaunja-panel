import React, {Component} from 'react'
import MaterialInput from './MaterialInput'
import Material from './Material'
import {Redirect} from 'react-router-dom'
import {NotificationManager} from 'react-notifications'

class Login extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            login: null,
            phone: '',
            username: '',
        }
    }


    login = () =>
    {
        setTimeout(() =>
        {
            if (this.state.phone.trim().length === 11 && this.state.username.trim().length > 0)
            {
                this.props.handleLoading(true).then(() =>
                {
                    const phone = this.state.phone.trim()
                    const username = this.state.username.trim().toLowerCase()

                    fetch('http://185.211.58.174:1435/user/login/admin', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                        },
                        body: JSON.stringify({
                            username: username,
                            phone: phone,
                        }),
                    })
                        .then((res) => res.json())
                        .then((resJson) =>
                        {
                            if (resJson.state === 1)
                            {
                                this.setState({...this.state, login: true}, () =>
                                {
                                    localStorage.setItem('phone', phone)
                                    localStorage.setItem('username', username)
                                    localStorage.setItem('id', resJson.form.id)
                                    this.props.getData()
                                })
                            }
                            else if (resJson.state === -6)
                            {
                                this.props.handleLoading(false).then(() =>
                                {
                                    NotificationManager.error('شما دسترسی لازم برای ورود به پنل را ندارید.')
                                })
                            }
                            else
                            {
                                this.props.handleLoading(false).then(() =>
                                {
                                    NotificationManager.error('اطلاعات ورودی اشتباه است.')
                                })
                            }
                        })
                        .catch(() =>
                        {
                            this.props.handleLoading(false).then(() =>
                            {
                                NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
                            })
                        })
                })

            }
            else if (this.state.phone.trim().length !== 11)
            {
                NotificationManager.warning('شماره تلفن وارد شده معتبر نیست!')
            }
            else
            {
                NotificationManager.warning('پسورد وارد شده معتبر نیست!')
            }
        }, 400)
    }

    handlePhone = (value) => this.setState({...this.state, phone: value})

    handleUsername = (value) => this.setState({...this.state, username: value})

    handleEnter = (e) => e.keyCode === 13 && this.login()

    render()
    {
        return (
            <div className='login-form'>
                {
                    this.state.login && <Redirect to='/'/>
                }
                <div className='login-form-title'>ورود</div>
                <MaterialInput name='phone' getValue={this.handlePhone} onKeyDown={this.handleEnter} maxLength={11} type='text' label='شماره تلفن' className='login-input' backgroundColor='#F1F2F7'/>
                <MaterialInput name='username' getValue={this.handleUsername} onKeyDown={this.handleEnter} type='password' label='نام کاربری' className='login-input' backgroundColor='#F1F2F7'/>
                <Material backgroundColor='rgba(241,242,247,0.6)' className='login-form-submit' onClick={this.login}>ورود</Material>
            </div>
        )
    }
}

export default Login