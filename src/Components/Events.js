import React, {Component} from 'react'
import Pencil from '../Media/Images/Pencil'
import CategoryImage from './CategoryImage'
import AddButton from './AddButton'
import MaterialInput from './MaterialInput'
import MyDatePicker from './DatePicker'
import Material from './Material'
import {NotificationManager} from 'react-notifications'
import Slick from 'react-slick'
import Notif from '../Media/Images/notif.png'
import NoneNotif from '../Media/Images/none-notif.png'
import Copy from '../Media/Images/copy.png'
import FancyMaps from './FancyMap'

class Events extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            level: 1,
            isCreating: false,
            isUpdating: false,
            loading: false,
            is_long: false,
            have_rating: false,
            category_id: this.props.category_id,
            name: '',
            address: '',
            description: '',
            info: '',

            start_day: null,
            start_month: null,
            start_year: null,

            end_day: null,
            end_month: null,
            end_year: null,

            start_time: '',
            start_time_valid: true,
            end_time: '',
            end_time_valid: true,
            location: '',

            old_pictures: [],
            previews: [],
            pictures: [],

            // NOTIFICATION THINGS
            notifModal: false,
            notif: [],

            search: '',
        }
    }

    componentWillReceiveProps(nextProps, nextContext)
    {
        if (nextProps.category_id !== this.state.category_id)
            this.setState({...this.state, category_id: nextProps.category_id})
    }

    handleCreating = () =>
    {
        if (!this.state.loading)
            this.setState({...this.state, isCreating: true})
    }

    handleClose = () =>
    {
        this.resetState().then(() =>
        {
            this.pictureInput.value = ''
        })
    }

    handleName = (e) =>
    {
        this.setState({...this.state, name: e})
    }

    handleAddress = (e) =>
    {
        this.setState({...this.state, address: e})
    }

    handleDescription = (e) =>
    {
        this.setState({...this.state, description: e})
    }

    handleInfo = (e) =>
    {
        this.setState({...this.state, info: e})
    }

    handleStartDate = (e) =>
    {
        const date = e.split('/')
        this.setState({
            ...this.state,
            start_day: parseInt(date[2]),
            start_month: parseInt(date[1]),
            start_year: parseInt(date[0]),
        })
    }

    handleEndDate = (e) =>
    {
        const date = e.split('/')
        this.setState({
            ...this.state,
            end_day: parseInt(date[2]),
            end_month: parseInt(date[1]),
            end_year: parseInt(date[0]),
        })
    }

    handleStartTime = (value) =>
    {
        let start_time = value.trim()
        const time = start_time.split(':')
        if (start_time.length > 3 && start_time.includes(':') && time[0].length > 0 && time[0].length < 3 && parseInt(time[0]) < 24 && time[1].length === 2 && parseInt(time[1]) < 60)
        {
            if (start_time[0] === '0') start_time = start_time.substring(1, start_time.length)
            this.setState({...this.state, start_time, start_time_valid: true})
        }
        else if (start_time.length > 4 || (start_time.length > 3 && (parseInt(time[0]) >= 24 || parseInt(time[1]) >= 60)))
        {
            this.setState({...this.state, start_time_valid: false})
        }
    }

    handleEndTime = (value) =>
    {
        let end_time = value.trim()
        const time = end_time.split(':')
        if (end_time.length > 3 && end_time.includes(':') && time[0].length > 0 && time[0].length < 3 && parseInt(time[0]) < 24 && time[1].length === 2 && parseInt(time[1]) < 60)
        {
            if (end_time[0] === '0') end_time = end_time.substring(1, end_time.length)
            this.setState({...this.state, end_time, end_time_valid: true})
        }
        else if (end_time.length > 4 || (end_time.length > 3 && (parseInt(time[0]) >= 24 || parseInt(time[1]) >= 60)))
        {
            this.setState({...this.state, end_time_valid: false})
        }
    }

    handleLong = (e) =>
    {
        this.setState({...this.state, is_long: e.target.checked})
    }

    handleRating = (e) =>
    {
        this.setState({...this.state, have_rating: e.target.checked})
    }

    handlePicture = (e) =>
    {
        let previews = [...this.state.previews]
        let pictures = [...this.state.pictures]
        e.preventDefault()
        let reader = new FileReader()
        let file = e.target.files[0]
        if (file)
        {
            reader.readAsDataURL(file)
            reader.onloadend = () =>
            {
                previews.push(reader.result)
                pictures.push(file)
                this.setState({...this.state, previews, pictures})
            }
        }
    }

    handleDelete(id, name)
    {
        let submit = window.confirm(`از حذف رویداد ${name} مطمئن هستید؟!`)
        if (submit)
        {
            this.props.handleLoading(true).then(() =>
            {
                fetch('http://185.211.58.174:1435/event/delete', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'auth': 'QEFiZWxtaXJpIEBIb3NleW5tb3VzYXZp',
                    },
                    body: JSON.stringify({
                        id: id,
                    }),
                })
                    .then((res) => res.json())
                    .then((resJson) =>
                    {
                        if (resJson.state === 1)
                        {
                            this.props.handleLoading(false).then(() =>
                            {
                                this.resetState().then(() =>
                                {
                                    this.props.removeEvents(id)
                                    NotificationManager.info('رویداد با موفقیت حذف شد.')
                                })
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
                    .catch((err) =>
                    {
                        this.props.handleLoading(false).then(() =>
                        {
                            NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
                        })
                    })
            })
        }
    }


    handleUpdate(event)
    {
        this.setState({
            ...this.state,
            level: 1,
            isCreating: true,
            isUpdating: true,
            loading: false,
            updateId: event.id,
            name: event.name,
            description: event.description,
            info: event.info,
            address: event.address,
            is_long: event.is_long,
            have_rating: event.have_rating,
            start_day: event.start_day,
            start_month: event.start_month,
            start_year: event.start_year,
            end_day: event.end_day,
            end_month: event.end_month,
            end_year: event.end_year,
            old_pictures: JSON.parse(event.pictures) ? JSON.parse(event.pictures) : [],
            previews: [],
            pictures: [],
            start_time: event.start_time,
            start_time_valid: true,
            end_time: event.end_time,
            end_time_valid: true,
            location: event.location,
        })
    }

    resetState()
    {
        return new Promise((resolve) =>
        {
            this.setState({
                ...this.state,
                level: 1,
                isCreating: false,
                isUpdating: false,
                loading: false,
                updateId: null,
                is_long: false,
                have_rating: false,
                category_id: this.props.category_id,
                name: '',
                address: '',
                description: '',
                info: '',

                start_day: null,
                start_month: null,
                start_year: null,

                end_day: null,
                end_month: null,
                end_year: null,

                start_time: '',
                start_time_valid: true,
                end_time: '',
                end_time_valid: true,
                location: '',

                old_pictures: [],
                previews: [],
                pictures: [],
            }, () => resolve())
        })
    }

    secondLevel = () =>
    {
        this.setState({...this.state, level: 2})
    }

    firstLevel = () =>
    {
        this.setState({...this.state, level: 1})
    }

    setPin = (pin) =>
    {
        this.setState({...this.state, location: pin})
    }

    deletePhoto(index)
    {
        let previews = [...this.state.previews]
        let pictures = [...this.state.pictures]
        pictures.splice(index, 1)
        previews.splice(index, 1)
        this.setState({...this.state, previews, pictures})
    }

    deleteOldPhoto(index)
    {
        let old_pictures = [...this.state.old_pictures]
        old_pictures.splice(index, 1)
        this.setState({...this.state, old_pictures})
    }

    copy(event)
    {
        let formData = new FormData()

        formData.append('category_id', event.category_id) //TODO Hoseyn

        formData.append('name', event.name)
        formData.append('description', event.description)
        formData.append('info', event.info)
        formData.append('address', event.address)
        formData.append('have_rating', event.have_rating)
        formData.append('is_long', event.is_long)
        formData.append('creator_id', '1')
        formData.append('start_day', event.start_day)
        formData.append('start_month', event.start_month)
        formData.append('start_year', event.start_year)
        formData.append('start_time', event.start_time)
        formData.append('end_time', event.end_time)
        formData.append('location', event.location)


        if (event.is_long)
        {
            formData.append('end_day', event.end_day)
            formData.append('end_month', event.end_month)
            formData.append('end_year', event.end_year)
        }

        fetch('http://185.211.58.174:1435/event/create', {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'auth': 'QEFiZWxtaXJpIEBIb3NleW5tb3VzYXZp',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseJson) =>
            {
                if (responseJson.state === 1)
                {
                    const id = responseJson.form.id

                    fetch(`http://185.211.58.174:1435/event/full/${id}`, {
                        headers: {
                            'Cache-Control': 'no-cache',
                        },
                    })
                        .then(res => res.json())
                        .then(resJson =>
                        {
                            if (resJson.state === 1)
                            {
                                this.props.addToEvents(resJson.form)
                                NotificationManager.success('رویداد با موفقیت کپی شد.')
                            }
                            else
                            {
                                NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                            }
                        })
                        .catch(() =>
                        {
                            NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                        })
                }
                else
                {
                    NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                }
            })
            .catch(() =>
            {
                NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید')
            })
    }

    submit = () =>
    {
        setTimeout(() =>
        {
            if (!this.state.isUpdating)
            {
                if (this.state.name.trim().length > 3 && this.state.start_day && this.state.start_time && this.state.start_time_valid && this.state.end_time && this.state.end_time_valid && this.state.location && (!this.state.is_long || this.state.end_day))
                {
                    if (
                        (!this.state.is_long && (parseInt(this.state.start_time.split(':')[0], 10) * 60 + parseInt(this.state.start_time.split(':')[1], 10) < parseInt(this.state.end_time.split(':')[0], 10) * 60 + parseInt(this.state.end_time.split(':')[1], 10))) ||
                        (this.state.is_long && (this.state.start_day + 30 * this.state.start_month + 365 * this.state.start_year <= this.state.end_day + 30 * this.state.end_month + 365 * this.state.end_year))
                    )
                    {
                        this.setState({...this.state, isCreating: false}, () =>
                        {
                            setTimeout(() => this.setState({...this.state, loading: true}, () =>
                            {
                                let formData = new FormData()
                                formData.append('name', this.state.name.trim())
                                formData.append('description', this.state.description.trim())
                                formData.append('info', this.state.info.trim())
                                formData.append('address', this.state.address.trim())
                                formData.append('category_id', this.state.category_id)
                                formData.append('have_rating', this.state.have_rating)
                                formData.append('is_long', this.state.is_long)
                                formData.append('creator_id', '1')
                                formData.append('start_day', this.state.start_day)
                                formData.append('start_month', this.state.start_month)
                                formData.append('start_year', this.state.start_year)
                                formData.append('start_time', this.state.start_time)
                                formData.append('end_time', this.state.end_time)
                                formData.append('location', this.state.location)


                                if (this.state.is_long)
                                {
                                    formData.append('end_day', this.state.end_day)
                                    formData.append('end_month', this.state.end_month)
                                    formData.append('end_year', this.state.end_year)
                                }

                                this.state.pictures.forEach((img, i) =>
                                {
                                    formData.append(i.toString(), this.state.pictures[i])
                                })

                                fetch('http://185.211.58.174:1435/event/create', {
                                    method: 'POST',
                                    headers: {
                                        'Cache-Control': 'no-cache',
                                        'auth': 'QEFiZWxtaXJpIEBIb3NleW5tb3VzYXZp',
                                    },
                                    body: formData,
                                })
                                    .then((response) => response.json())
                                    .then((responseJson) =>
                                    {
                                        if (responseJson.state === 1)
                                        {
                                            const id = responseJson.form.id

                                            fetch(`http://185.211.58.174:1435/event/full/${id}`, {
                                                headers: {
                                                    'Cache-Control': 'no-cache',
                                                },
                                            })
                                                .then(res => res.json())
                                                .then(resJson =>
                                                {
                                                    if (resJson.state === 1)
                                                    {
                                                        this.resetState().then(() =>
                                                        {
                                                            this.pictureInput.value = ''
                                                            this.props.addToEvents(resJson.form)
                                                            NotificationManager.success('رویداد با موفقیت افزوده شد.')
                                                        })
                                                    }
                                                    else
                                                    {
                                                        this.setState({...this.state, loading: false}, () =>
                                                        {
                                                            NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                                                        })
                                                    }
                                                })
                                                .catch(() =>
                                                {
                                                    this.setState({...this.state, loading: false}, () =>
                                                    {
                                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                                                    })
                                                })
                                        }
                                        else
                                        {
                                            this.setState({...this.state, loading: false}, () =>
                                            {
                                                console.log(responseJson)
                                                NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                                            })
                                        }
                                    })
                                    .catch(() =>
                                    {
                                        this.setState({...this.state, loading: false}, () =>
                                        {
                                            NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید')
                                        })
                                    })
                            }), 300)
                        })
                    }
                    else
                    {
                        if (this.state.is_long) NotificationManager.error('تاریخ شروع نمی تواند قبل از تاریخ پایان باشد!')
                        else NotificationManager.error('ساعت شروع نمی تواند قبل از ساعت پایان باشد!')
                    }
                }
                else
                {
                    if (!this.state.name.trim())
                    {
                        NotificationManager.error('لطفا نام دسته بندی را وارد نمایید.')
                    }
                    else if (this.state.name.trim().length <= 3)
                    {
                        NotificationManager.warning('طول نام باید بیش از 3 کاراکتر باشد.')
                    }
                    if (!this.state.start_day)
                    {
                        NotificationManager.error('لطفا تاریخ شروع را وارد نمایید.')
                    }
                    if (this.state.is_long && !this.state.end_day)
                    {
                        NotificationManager.error('لطفا تاریخ پایان را وارد نمایید.')
                    }
                    if (!this.state.start_time)
                    {
                        NotificationManager.error('لطفا ساعت شروع را وارد نمایید.')
                    }
                    if (!this.state.end_time)
                    {
                        NotificationManager.error('لطفا ساعت پایان را وارد نمایید.')
                    }
                    if (!this.state.start_time_valid && this.state.start_time)
                    {
                        NotificationManager.error('لطفا ساعت شروع را به فرمت ذکر شده وارد نمایید.')
                    }
                    if (!this.state.end_time_valid && this.state.end_time)
                    {
                        NotificationManager.error('لطفا ساعت پایان را به فرمت ذکر شده وارد نمایید.')
                    }
                    if (!this.state.location)
                    {
                        NotificationManager.error('لطفا لوکیشن را مشخص نمایید.')
                    }
                }
            }
            else
            {

                if (this.state.name.trim().length > 3 && this.state.start_day && this.state.start_time && this.state.start_time_valid && this.state.end_time && this.state.end_time_valid && this.state.location && (!this.state.is_long || this.state.end_day))
                {
                    this.setState({...this.state, isCreating: false}, () =>
                    {
                        setTimeout(() => this.setState({...this.state, loading: true}, () =>
                        {
                            let formData = new FormData()
                            formData.append('id', this.state.updateId)
                            formData.append('name', this.state.name.trim())
                            formData.append('description', this.state.description.trim())
                            formData.append('info', this.state.info.trim())
                            formData.append('address', this.state.address.trim())
                            formData.append('category_id', this.state.category_id)
                            formData.append('have_rating', this.state.have_rating)
                            formData.append('is_long', this.state.is_long)
                            formData.append('start_day', this.state.start_day)
                            formData.append('start_month', this.state.start_month)
                            formData.append('start_year', this.state.start_year)
                            formData.append('start_time', this.state.start_time)
                            formData.append('end_time', this.state.end_time)
                            formData.append('location', this.state.location)
                            formData.append('old_pictures', JSON.stringify(this.state.old_pictures))


                            if (this.state.is_long)
                            {
                                formData.append('end_day', this.state.end_day)
                                formData.append('end_month', this.state.end_month)
                                formData.append('end_year', this.state.end_year)
                            }

                            this.state.pictures.forEach((img, i) =>
                            {
                                formData.append(i.toString(), this.state.pictures[i])
                            })

                            fetch('http://185.211.58.174:1435/event/update', {
                                method: 'POST',
                                headers: {
                                    'Cache-Control': 'no-cache',
                                    'auth': 'QEFiZWxtaXJpIEBIb3NleW5tb3VzYXZp',
                                },
                                body: formData,
                            })
                                .then((response) => response.json())
                                .then((responseJson) =>
                                {
                                    if (responseJson.state === 1)
                                    {
                                        fetch(`http://185.211.58.174:1435/event/full/${this.state.updateId}`, {
                                            headers: {
                                                'Cache-Control': 'no-cache',
                                            },
                                        })
                                            .then(res => res.json())
                                            .then(resJson =>
                                            {
                                                if (resJson.state === 1)
                                                {
                                                    this.resetState().then(() =>
                                                    {
                                                        this.pictureInput.value = ''
                                                        this.props.updateToEvents(resJson.form)
                                                        NotificationManager.success('رویداد با موفقیت آپدیت شد.')
                                                    })
                                                }
                                                else
                                                {
                                                    this.setState({...this.state, loading: false}, () =>
                                                    {
                                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                                                    })
                                                }
                                            })
                                            .catch(() =>
                                            {
                                                this.setState({...this.state, loading: false}, () =>
                                                {
                                                    NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                                                })
                                            })
                                    }
                                    else
                                    {
                                        this.setState({...this.state, loading: false}, () =>
                                        {
                                            console.log(responseJson)
                                            NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                                        })
                                    }
                                })
                                .catch((e) =>
                                {
                                    console.log(e.message)
                                    this.setState({...this.state, loading: false}, () =>
                                    {
                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید')
                                    })
                                })
                        }), 300)
                    })
                }
                else
                {
                    if (!this.state.name.trim())
                    {
                        NotificationManager.error('لطفا نام دسته بندی را وارد نمایید.')
                    }
                    else if (this.state.name.trim().length <= 3)
                    {
                        NotificationManager.warning('طول نام باید بیش از 3 کاراکتر باشد.')
                    }
                    if (!this.state.start_day)
                    {
                        NotificationManager.error('لطفا تاریخ شروع را وارد نمایید.')
                    }
                    if (this.state.is_long && !this.state.end_day)
                    {
                        NotificationManager.error('لطفا تاریخ پایان را وارد نمایید.')
                    }
                    if (!this.state.start_time)
                    {
                        NotificationManager.error('لطفا ساعت شروع را وارد نمایید.')
                    }
                    if (!this.state.end_time)
                    {
                        NotificationManager.error('لطفا ساعت پایان را وارد نمایید.')
                    }
                    if (!this.state.start_time_valid && this.state.start_time)
                    {
                        NotificationManager.error('لطفا ساعت شروع را به فرمت ذکر شده وارد نمایید.')
                    }
                    if (!this.state.end_time_valid && this.state.end_time)
                    {
                        NotificationManager.error('لطفا ساعت پایان را به فرمت ذکر شده وارد نمایید.')
                    }
                    if (!this.state.location)
                    {
                        NotificationManager.error('لطفا لوکیشن را مشخص نمایید.')
                    }
                }

            }
        }, 400)
    }

    showNotifModal(e, event)
    {
        this.notifModal.style.transition = 'all linear 0s'
        let rect = e.target.getBoundingClientRect()
        let top = rect.top + 'px'
        let left = rect.left + 'px'
        this.notifModal.style.top = top
        this.notifModal.style.left = left

        setTimeout(() =>
        {
            let notification = []
            if (event.notification)
            {
                notification = JSON.parse(event.notification)
            }
            this.setState({...this.state, notifModal: true, notif: notification, top, left, event}, () =>
            {
                this.notifModal.style.transition = 'all linear 0.2s'
                this.notifModal.style.top = 'calc((100% - 450px) / 2)'
                this.notifModal.style.left = 'calc((100% - 650px) / 2)'
            })
        }, 100)
    }

    hideNotifModal = () =>
    {
        this.notifModal.style.top = this.state.top
        this.notifModal.style.left = this.state.left
        this.setState({...this.state, notif: [], notifModal: false})
    }

    addNotif = () =>
    {
        const oldNotif = this.state.notif
        if (this.state.event.is_long || (!this.state.event.is_long && oldNotif.length === 0))
        {
            this.setState({...this.state, notif: [...oldNotif, {id: Math.floor(Math.random() * 100000), title: '', description: '', date: '', time: ''}]})
        }
        else NotificationManager.error('این رویداد فقط می تواند یک نوتیفیکشن داشته باشد.')
    }

    delNotif(index)
    {
        let oldNotif = this.state.notif
        oldNotif.splice(index, 1)
        this.setState({...this.state, notif: oldNotif})
    }

    submitNotif = () =>
    {
        const notif = this.state.notif
        let error = false
        notif.forEach((notif, i) =>
        {
            const time = notif.time
            const date = notif.date
            const title = notif.title
            const description = notif.description

            if (title.length === 0)
            {
                error = true
                NotificationManager.error(`لطفا عنوان نوتیفیکیشن ${i + 1}م را وارد کنید!`)
            }

            if (description.length === 0)
            {
                error = true
                NotificationManager.error(`لطفا توضیحات نوتیفیکیشن ${i + 1}م را وارد کنید!`)
            }

            if (date.length === 0)
            {
                error = true
                NotificationManager.error(`لطفا تاریخ نوتیفیکشن ${i + 1}م را وارد کنید!`)
            }

            if (time.length > 3 && time.includes(':'))
            {
                const timeArr = time.split(':')
                if (!(timeArr[0].length > 0 && timeArr[0].length < 3 && parseInt(timeArr[0]) < 24 && timeArr[1].length === 2 && parseInt(timeArr[1]) < 60))
                {
                    error = true
                    NotificationManager.error(`تایم وارد شده برای نوتیفیکیشن ${i + 1}م صحیح نیست !`)
                }
            }
            else
            {
                error = true
                NotificationManager.error(`لطفا تایم درستی برای نوتیفیکشن ${i + 1}م وارد کنید!`)
            }

        })

        if (!error)
        {
            this.props.handleLoading(true).then(() =>
            {
                fetch('http://185.211.58.174:1435/notification/add', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'auth': 'QEFiZWxtaXJpIEBIb3NleW5tb3VzYXZp',
                    },
                    body: JSON.stringify({
                        event_id: this.state.event.id,
                        notification: JSON.stringify(notif),
                    }),
                })
                    .then((res) => res.json())
                    .then((resJson) =>
                    {
                        if (resJson.state === 1)
                        {

                            fetch(`http://185.211.58.174:1435/event/full/${this.state.event.id}`, {
                                headers: {
                                    'Cache-Control': 'no-cache',
                                },
                            })
                                .then(res => res.json())
                                .then(resJson =>
                                {
                                    if (resJson.state === 1)
                                    {
                                        this.props.handleLoading(false).then(() =>
                                        {
                                            this.props.updateToEvents(resJson.form)
                                            NotificationManager.success('نوتیفیکیشن با موفقیت اضافه شد.')
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
                                .catch(() =>
                                {
                                    this.props.handleLoading(false).then(() =>
                                    {
                                        NotificationManager.error('خطایی رخ داده است! اتصال خود را چک کنید!')
                                    })
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
                    .catch(() =>
                    {
                        this.props.handleLoading(false).then(() =>
                        {
                            NotificationManager.error('خطایی رخ داده است! اینترنت خود را چک کنید.')
                        })
                    })
            })
        }
    }

    search = (e) => this.setState({...this.state, search: e.target.value})

    removeSearch = () => this.setState({...this.state, search: ''})

    render()
    {
        const eventsArr = this.props.events && this.props.events.filter(p =>
            p.name.includes(this.state.search) || p.description.includes(this.state.search) || p.info.includes(this.state.search) || p.address.includes(this.state.search),
        )

        return (
            <div>

                {this.props.header && <div className='event-item-header'>{this.props.header}</div>}

                {
                    this.props.events && this.props.events.length > 0 && <div className='event-search-fluent'>
                        <input type='text' className='category-search' value={this.state.search} placeholder='جست و جو ...' onChange={this.search}/>
                        <div className='category-close-search' onClick={this.removeSearch}>✕</div>
                    </div>
                }

                <div className='category-cont'>
                    {
                        eventsArr.map((event) =>
                            <div key={event.id} className='event'>

                                <div className='category-edit-cont' onClick={this.handleUpdate.bind(this, event)}>
                                    <Pencil className='category-edit'/>
                                </div>

                                <div className='category-close-cont' onClick={(e) => this.showNotifModal(e, event)}>
                                    {
                                        event.notification && JSON.parse(event.notification).length > 0 ?
                                            <img className='event-notif' src={Notif} alt=''/>
                                            :
                                            <img className='event-notif' src={NoneNotif} alt=''/>
                                    }
                                </div>

                                <div className='copy-cont'>
                                    <img className='copy' src={Copy} alt='' onClick={this.copy.bind(this, event)}/>
                                </div>

                                {
                                    event.pictures && JSON.parse(event.pictures).length > 0 ?
                                        <div className='event-slick-images'>
                                            <Slick {...{dots: true}}>
                                                {
                                                    JSON.parse(event.pictures) && JSON.parse(event.pictures).map((img, i) =>
                                                        <CategoryImage key={i} picture={img}/>,
                                                    )
                                                }
                                            </Slick>
                                        </div>
                                        : null
                                }

                                <div className='event-name'>{event.name}</div>
                                <div className='category-address'>
                                    {
                                        event.description ?
                                            <span>
                                                    <span className='category-description-title'>توضیحات: </span>
                                                    <span>{event.description}</span>
                                                </span>
                                            : null
                                    }
                                </div>
                                <div className='event-info'>
                                    {
                                        event.info ?
                                            <span>
                                                    <span className='category-description-title'>اطلاعات: </span>
                                                    <span>{event.info}</span>
                                                </span>
                                            : null
                                    }
                                </div>
                                <div className='event-description'>
                                    {
                                        event.address ?
                                            <span>
                                                    <span className='category-description-title'>آدرس: </span>
                                                    <span>{event.address}</span>
                                                </span>
                                            : null
                                    }
                                </div>
                                <div className='event-location'>
                                    <FancyMaps pin={event.location} disableChange={true} disableSearch={true}/>
                                </div>
                                <div className='category-footer'>
                                    <div className='category-date'>شروع: {event.start_year + '/' + event.start_month + '/' + event.start_day}</div>
                                    <div className='category-selectable'>پایان: {
                                        event.end_day ?
                                            event.end_year + '/' + event.end_month + '/' + event.end_day :
                                            event.start_year + '/' + event.start_month + '/' + event.start_day}
                                    </div>
                                </div>
                            </div>,
                        )
                    }
                </div>

                <div className={this.state.isCreating || this.state.notifModal ? 'modal' : 'modal-hide'}/>
                <div className={this.state.isCreating ? 'event-create-modal' : 'event-create-modal-hide'}>

                    <div className='category-create-close' onClick={this.handleClose}>✖</div>

                    <div className='category-create-level'>2 / {this.state.level}</div>

                    <div className='category-create-modal-title'>ایجاد رویداد</div>

                    <div className={this.state.level === 1 ? 'event-create-modal-firstLevel' : 'event-create-modal-firstLevel-hide'}>
                        <MaterialInput defaultValue={this.state.isUpdating ? this.state.name : undefined}
                                       className='event-create-modal-name'
                                       reload={!this.state.isCreating}
                                       backgroundColor='white'
                                       type='text'
                                       label='نام *'
                                       getValue={this.handleName}
                                       name='name'
                        />
                        <MaterialInput defaultValue={this.state.isUpdating ? this.state.address : undefined}
                                       className='event-create-modal-name'
                                       reload={!this.state.isCreating}
                                       backgroundColor='white'
                                       type='text'
                                       label='آدرس'
                                       getValue={this.handleAddress}
                                       name='address'
                        />

                        <div className='event-create-modal-select'>

                            رویداد بیش از یک روز است؟

                            <div className='slideThree'>
                                <input type='checkbox' id='slideThreee' checked={this.state.is_long} onChange={this.handleLong}/>
                                <label htmlFor='slideThreee'/>
                            </div>
                        </div>

                        <div className='event-create-modal-buttons'>
                            <MyDatePicker defaultValue={this.state.isUpdating ? this.state.start_year + '/' + this.state.start_month + '/' + this.state.start_day : undefined}
                                          className={this.state.is_long ? 'event-create-modal-date1' : 'event-create-modal-date-all'}
                                          placeHolder='تاریخ شروع *'
                                          getValue={this.handleStartDate}
                                          reload={!this.state.isCreating}

                            />
                            <MyDatePicker defaultValue={this.state.isUpdating && this.state.is_long ? this.state.end_year + '/' + this.state.end_month + '/' + this.state.end_day : undefined}
                                          className={this.state.is_long ? 'event-create-modal-date' : 'event-create-modal-date hide'}
                                          placeHolder='تاریخ پایان *'
                                          getValue={this.handleEndDate}
                                          reload={!this.state.isCreating}
                            />
                        </div>

                        <div className='event-create-modal-buttons'>
                            <MaterialInput defaultValue={this.state.isUpdating ? this.state.start_time : undefined}
                                           className='event-create-modal-time'
                                           reload={!this.state.isCreating}
                                           backgroundColor='white'
                                           type='text'
                                           label='ساعت شروع *'
                                           getValue={this.handleStartTime}
                                           borderColor={!this.state.start_time_valid ? 'red' : null}
                            />

                            <MaterialInput defaultValue={this.state.isUpdating ? this.state.end_time : undefined}
                                           className='event-create-modal-time'
                                           reload={!this.state.isCreating}
                                           backgroundColor='white'
                                           type='text'
                                           label='ساعت پایان *'
                                           getValue={this.handleEndTime}
                                           borderColor={!this.state.end_time_valid ? 'red' : null}
                            />
                        </div>

                        <div className='event-create-modal-hint'>
                            مثال: 2:05 ، 13:05
                        </div>

                        <div className='event-create-modal-select'>

                            نظر سنجی دارد؟

                            <div className='slideThree'>
                                <input type='checkbox' id='slideThree' checked={this.state.have_rating} onChange={this.handleRating}/>
                                <label htmlFor='slideThree'/>
                            </div>
                        </div>

                        <div className='event-create-modal-pic'>
                            عکس را انتخاب کنید
                            <input type='file' ref={e => this.pictureInput = e} accept='.jpg,.jpeg' className='category-create-modal-pic-input' onChange={this.handlePicture}/>
                        </div>

                        <div className='event-create-modal-pictures'>
                            {
                                this.state.isUpdating && this.state.old_pictures && this.state.old_pictures.map((img, index) =>
                                    <div key={index} className='event-create-modal-preview-cont' onClick={this.deleteOldPhoto.bind(this, index)}>
                                        <img className='event-create-modal-preview' src={img} alt=''/>
                                    </div>,
                                )
                            }
                            {
                                this.state.previews.map((img, index) =>
                                    <div key={index} className='event-create-modal-preview-cont' onClick={this.deletePhoto.bind(this, index)}>
                                        <img className='event-create-modal-preview' src={img} alt=''/>
                                    </div>,
                                )
                            }
                        </div>
                        {
                            this.state.isUpdating ?
                                <div className='event-create-modal-buttons'>
                                    <Material className='event-create-modal-button-cancel' backgroundColor='rgba(255,255,255,0.5)' onClick={this.handleDelete.bind(this, this.state.updateId, this.state.name)}>حـذف</Material>
                                    <Material className='event-create-modal-button' backgroundColor='rgba(255,255,255,0.5)' onClick={this.secondLevel}>بـعـدی</Material>
                                </div>
                                :
                                <Material className='event-create-modal-submit' backgroundColor='rgba(255,255,255,0.5)' onClick={this.secondLevel}>بـعـدی</Material>
                        }
                    </div>
                    <div className={this.state.level === 2 ? 'event-create-modal-firstLevel' : 'event-create-modal-secondLevel-hide'}>
                        <MaterialInput defaultValue={this.state.isUpdating ? this.state.description : undefined}
                                       className='event-create-modal-desc'
                                       reload={!this.state.isCreating}
                                       backgroundColor='white'
                                       type='text'
                                       label='توضیحات'
                                       isTextArea={true}
                                       getValue={this.handleDescription}
                                       name='description'
                        />
                        <MaterialInput defaultValue={this.state.isUpdating ? this.state.info : undefined}
                                       className='event-create-modal-desc'
                                       reload={!this.state.isCreating}
                                       backgroundColor='white'
                                       type='text'
                                       label='اطلاعات'
                                       isTextArea={true}
                                       getValue={this.handleInfo}
                                       name='info'
                        />

                        <div className='event-create-modal-map'>
                            <FancyMaps id={this.state.updateId} pin={this.state.isUpdating ? this.state.location : null} disableChange={false} getPin={this.setPin}/>
                        </div>
                        <div className='event-create-modal-buttons'>
                            <Material className='event-create-modal-button-cancel' backgroundColor='rgba(255,255,255,0.5)' onClick={this.firstLevel}>قـبـلی</Material>
                            <Material className='event-create-modal-button' backgroundColor='rgba(255,255,255,0.5)' onClick={this.submit}>ثـبـت</Material>
                        </div>
                    </div>
                </div>


                <div ref={e => this.notifModal = e} className={this.state.notifModal ? 'notif-modal' : 'notif-modal-hide'}>
                    <div className='notif-create-close' onClick={this.hideNotifModal}>✖</div>
                    <div className='category-create-submit' onClick={this.submitNotif}>✔</div>
                    <Material className='category-create-add' onClick={this.addNotif} backgroundColor='rgba(0,0,0,0.3)'>+</Material>

                    {
                        this.state.notif.length > 0 ?
                            <div className='notif-modal-cont'>
                                {
                                    this.state.notif.map((notif, i) =>
                                        <div key={i} className='notif-modal-container'>
                                            <input placeholder='عنوان' className='notif-modal-field' type='text' defaultValue={notif.title} onChange={(e) => notif.title = e.target.value.trim()}/>
                                            <textarea placeholder='توضیحات' className='notif-modal-field-dec' defaultValue={notif.description} onChange={(e) => notif.description = e.target.value.trim()}/>
                                            <MyDatePicker defaultValue={notif.date}
                                                          className='notif-modal-field-date'
                                                          placeHolder='تاریخ'
                                                          getValue={(date) => notif.date = date}
                                                          reload={!this.state.notifModal}
                                            />
                                            <input placeholder='زمان' className='notif-modal-field-time' type='text' defaultValue={notif.time} onChange={(e) => notif.time = e.target.value.trim()}/>
                                            <Material className='notif-modal-field-del' onClick={(i) => this.delNotif(i)}>✖</Material>
                                        </div>,
                                    )
                                }
                            </div>
                            :
                            <div className='notif-modal-none'>نوتیفیکیشنی وجود ندارد !</div>
                    }

                </div>


                {
                    this.props.addToEvents ?
                        <AddButton loading={this.state.loading} onClick={this.handleCreating}/>
                        :
                        <span/>
                }
            </div>
        )
    }
}

export default Events