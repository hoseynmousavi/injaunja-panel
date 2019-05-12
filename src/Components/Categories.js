import React, {Component} from 'react'
import Pencil from '../Media/Images/Pencil'
import MaterialInput from './MaterialInput'
import Material from './Material'
import {NotificationManager} from 'react-notifications'
import AddButton from './AddButton'
import CategoryImage from './CategoryImage'
import {Link} from 'react-router-dom'
import Fluent from './Fluent'

class Categories extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            isCreating: false, //to open modal , name is gonna lie
            loading: false,
            name: '',
            description: '',
            selectable: false,
            parent_id: this.props.parent_id,
            picture: null,
            picturePreview: '',
            svg: null,
            svgPreview: '',
            isUpdating: false,
            updateId: 0,
            search: '',
        }
    }

    componentWillReceiveProps(nextProps, nextContext)
    {
        if (nextProps.parent_id !== this.state.parent_id)
            this.setState({...this.state, parent_id: nextProps.parent_id})
    }

    handleName = (e) =>
    {
        this.setState({...this.state, name: e})
    }

    handleDescription = (e) =>
    {
        this.setState({...this.state, description: e})
    }

    handlePicture = (e) =>
    {
        e.preventDefault()
        let reader = new FileReader()
        let file = e.target.files[0]
        if (file)
        {
            reader.readAsDataURL(file)
            reader.onloadend = () =>
            {
                this.setState({...this.state, picture: file, picturePreview: reader.result})
            }
        }
    }

    handleSvg = (e) =>
    {
        e.preventDefault()
        let reader = new FileReader()
        let file = e.target.files[0]
        if (file)
        {
            reader.readAsDataURL(file)
            reader.onloadend = () =>
            {
                this.setState({...this.state, svg: file, svgPreview: reader.result})
            }
        }
    }

    handleSelect = (e) =>
    {
        if (this.state.isUpdating && e.target.checked)
            NotificationManager.warning('همچین تغییری ممکن نیست!')
        else this.setState({...this.state, selectable: e.target.checked})
    }

    submit = () =>
    {
        setTimeout(() =>
        {
            if (!this.state.isUpdating)
            {
                if (this.state.name.trim().length > 3 && this.state.description.trim().length > 3)
                {
                    this.setState({...this.state, isCreating: false}, () =>
                    {
                        setTimeout(() => this.setState({...this.state, loading: true}, () =>
                        {
                            let formData = new FormData()
                            const picture = this.state.picture
                            const svg = this.state.svg
                            formData.append('name', this.state.name.trim())
                            formData.append('description', this.state.description.trim())
                            formData.append('parent_id', this.state.parent_id)
                            formData.append('selectable', this.state.selectable)
                            formData.append('picture', picture)
                            formData.append('svg', svg)

                            fetch('https://restful.injaunja.com/category/create', {
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

                                        fetch(`https://restful.injaunja.com/category/${id}`, {
                                            headers: {
                                                'Cache-Control': 'no-cache',
                                            },
                                        })
                                            .then(res => res.json())
                                            .then(resJson =>
                                            {
                                                if (resJson.state === 1)
                                                {
                                                    this.setState({...this.state, loading: false, name: '', description: '', selectable: false, picture: null, picturePreview: '', svg: null, svgPreview: ''}, () =>
                                                    {
                                                        this.pictureInput.value = ''
                                                        this.svgInput.value = ''
                                                        this.props.addToCategories(resJson.form)
                                                        NotificationManager.success('دسته بندی با موفقیت افزوده شد.')
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
                    if (!this.state.name.trim())
                    {
                        NotificationManager.error('لطفا نام دسته بندی را وارد نمایید.')
                    }
                    else if (this.state.name.trim().length <= 3)
                    {
                        NotificationManager.warning('طول نام باید بیش از 3 کاراکتر باشد.')
                    }
                    if (!this.state.description.trim())
                    {
                        NotificationManager.error('لطفا توضیحات دسته بندی را وارد نمایید.')
                    }
                    else if (this.state.description.trim().length <= 3)
                    {
                        NotificationManager.warning('طول توضیحات باید بیش از 3 کاراکتر باشد.')
                    }
                }
            }
            else
            {
                if (this.state.name.trim().length > 3 && this.state.description.trim().length > 3)
                {
                    this.setState({...this.state, isCreating: false}, () =>
                    {
                        setTimeout(() => this.setState({...this.state, loading: true}, () =>
                        {
                            let formData = new FormData()
                            const picture = this.state.picture
                            const svg = this.state.svg
                            formData.append('id', this.state.updateId)
                            formData.append('name', this.state.name.trim())
                            formData.append('description', this.state.description.trim())
                            formData.append('picture', picture)
                            formData.append('svg', svg)
                            formData.append('selectable', this.state.selectable)

                            fetch('https://restful.injaunja.com/category/update', {
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
                                        fetch(`https://restful.injaunja.com/category/${this.state.updateId}`, {
                                            headers: {
                                                'Cache-Control': 'no-cache',
                                            },
                                        })
                                            .then(res => res.json())
                                            .then(resJson =>
                                            {
                                                if (resJson.state === 1)
                                                {
                                                    this.props.updateToCategories(resJson.form).then(() =>
                                                    {
                                                        this.setState({...this.state, loading: false, name: '', description: '', selectable: false, picture: null, picturePreview: '', svg: null, svgPreview: '', isUpdating: false, updateId: 0}, () =>
                                                        {
                                                            this.pictureInput.value = ''
                                                            this.svgInput.value = ''
                                                            NotificationManager.info('دسته بندی با موفقیت آپدیت شد.')
                                                        })
                                                    })
                                                }
                                                else
                                                {
                                                    this.setState({...this.state, loading: false}, () =>
                                                    {
                                                        NotificationManager.error('سرور با مشکل مواجه شده است.')
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
                                            NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
                                        })
                                    }
                                })
                                .catch((err) =>
                                {
                                    this.setState({...this.state, loading: false}, () =>
                                    {
                                        NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید.')
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
                    if (!this.state.description.trim())
                    {
                        NotificationManager.error('لطفا توضیحات دسته بندی را وارد نمایید.')
                    }
                    else if (this.state.description.trim().length <= 3)
                    {
                        NotificationManager.warning('طول توضیحات باید بیش از 3 کاراکتر باشد.')
                    }
                }
            }

        }, 400)
    }

    handleCreating = () =>
    {
        if (!this.state.loading && this.props.addToCategories)
            this.setState({...this.state, isCreating: true})
        else if (!this.props.addToCategories)
        {
            NotificationManager.error('در این قسمت امکان ساخت وجود ندارد!')
        }
    }

    handleClose = () =>
    {
        this.setState({...this.state, isCreating: false, isUpdating: false, updateId: 0, name: '', description: '', selectable: false, picture: null, picturePreview: '', svg: null, svgPreview: ''}, () =>
        {
            this.pictureInput.value = ''
            this.svgInput.value = ''
        })
    }

    handleDelete(id, name)
    {
        let submit = window.confirm(`از حذف دسته بندی ${name} مطمئن هستید؟!`)
        if (submit)
        {
            this.props.handleLoading(true).then(() =>
            {
                fetch('https://restful.injaunja.com/category/delete', {
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
                                this.props.removeCategories(id).then(() =>
                                {
                                    NotificationManager.info('دسته بندی با موفقیت حذف شد.')
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

    handleUpdate(category)
    {
        this.setState({
            ...this.state,
            isCreating: true,
            isUpdating: true,
            updateId: category.id,
            name: category.name,
            description: category.description,
            picture: null,
            picturePreview: category.picture ? category.picture : '',
            svg: null,
            svgPreview: category.svg ? category.svg : '',
            selectable: category.selectable,
        })
    }

    search = (e) => this.setState({...this.state, search: e.target.value})

    removeSearch = () => this.setState({...this.state, search: ''})

    render()
    {
        const categoriesArr = this.props.categories && this.props.categories.filter(p =>
            p.name.includes(this.state.search) || p.description.includes(this.state.search),
        )

        return (
            <React.Fragment>
                {
                    this.props.header && <Fluent fluentColor='#cccccc' className='category-search-fluent'>
                        <div className='category-item-header'>{this.props.header}</div>
                    </Fluent>
                }
                {
                    this.props.categories && this.props.categories.length > 0 && <Fluent fluentColor='#cccccc' className='category-search-fluent'>
                        <input type='text' className='category-search' value={this.state.search} placeholder='جست و جو ...' onChange={this.search}/>
                        <div className='category-close-search' onClick={this.removeSearch}>✕</div>
                    </Fluent>
                }

                <div className='category-cont'>
                    {
                        categoriesArr.map((category) =>
                            <div key={category.id} className='category-new-cont'>
                                <Fluent fluentColor='#b9b9b9' className='category'>
                                    {
                                        this.props.updateToCategories ?
                                            <div className='category-edit-cont' onClick={this.handleUpdate.bind(this, category)}>
                                                <Pencil className='category-edit'/>
                                            </div>
                                            :
                                            null
                                    }

                                    {
                                        this.props.removeCategories ?
                                            <div className='category-close-cont' onClick={this.handleDelete.bind(this, category.id, category.name)}>
                                                <div className='category-close'>✕</div>
                                            </div>
                                            :
                                            null
                                    }

                                    {
                                        !category.selectable ?
                                            <Link className='category-link' to={`/Categories/Children/${category.id}`}>
                                                <CategoryImage picture={category.picture}/>
                                                <div className='category-name'>{category.name}</div>
                                                <div className='category-description'>{category.description}</div>
                                                <div className='category-footer'>
                                                    <div className='category-date'>ایجاد: {category.create_date}</div>
                                                    <div className='category-selectable'>قابل انتخاب: {category.selectable ?
                                                        <div className='category-selectable-logo'>✔</div> :
                                                        <div className='category-selectable-logo'>✖</div>}
                                                    </div>
                                                </div>
                                            </Link>
                                            :
                                            <Link className='category-link' to={`/Events/${category.id}`}>
                                                <CategoryImage picture={category.picture}/>
                                                <div className='category-name'>{category.name}</div>
                                                <div className='category-description'>{category.description}</div>
                                                <div className='category-footer'>
                                                    <div className='category-date'>ایجاد: {category.create_date}</div>
                                                    <div className='category-selectable'>قابل انتخاب: {category.selectable ?
                                                        <div className='category-selectable-logo'>✔</div> :
                                                        <div className='category-selectable-logo'>✖</div>}
                                                    </div>
                                                </div>
                                            </Link>
                                    }
                                </Fluent>
                            </div>,
                        )
                    }
                </div>

                <div className={this.state.isCreating ? 'modal' : 'modal-hide'}/>
                <div className={this.state.isCreating ? 'category-create-modal' : 'category-create-modal-hide'}>

                    <div className='category-create-close' onClick={this.handleClose}>✖</div>

                    <div className='category-create-modal-title'>ایجاد دسته بندی</div>
                    <MaterialInput defaultValue={this.state.isUpdating ? this.state.name : undefined}
                                   className='category-create-modal-name'
                                   reload={!this.state.isCreating}
                                   backgroundColor='white'
                                   type='text'
                                   label='نام *'
                                   getValue={this.handleName}
                    />
                    <MaterialInput defaultValue={this.state.isUpdating ? this.state.description : undefined}
                                   className='category-create-modal-desc'
                                   reload={!this.state.isCreating}
                                   backgroundColor='white'
                                   type='text'
                                   label='توضیحات *'
                                   isTextArea={true}
                                   getValue={this.handleDescription}
                    />

                    <div className='category-create-modal-pic'>
                        {
                            this.state.picturePreview.length > 0 ?
                                <img className='category-create-modal-pic-img' src={this.state.picturePreview} alt=''/>
                                :
                                'عکس را انتخاب کنید'
                        }
                        <input type='file' ref={e => this.pictureInput = e} accept='.jpg,.jpeg' className='category-create-modal-pic-input' onChange={this.handlePicture}/>
                    </div>

                    <div className='category-create-modal-pic'>
                        {
                            this.state.svgPreview.length > 0 ?
                                <img className='category-create-modal-pic-img' src={this.state.svgPreview} alt=''/>
                                :
                                'svg را انتخاب کنید'
                        }
                        <input type='file' ref={e => this.svgInput = e} accept='.svg' className='category-create-modal-pic-input' onChange={this.handleSvg}/>
                    </div>

                    <div className='category-create-modal-select'>

                        قابل انتخاب:

                        <div className='slideThree'>
                            <input type='checkbox' id='slideThree' checked={this.state.selectable} onChange={this.handleSelect}/>
                            <label htmlFor='slideThree'/>
                        </div>
                    </div>

                    <Material className='category-create-modal-submit' backgroundColor='rgba(255,255,255,0.5)' onClick={this.submit}>
                        تـایـیـد
                    </Material>
                </div>

                {
                    this.props.addToCategories ?
                        <AddButton loading={this.state.loading} onClick={this.handleCreating}/>
                        :
                        <span/>
                }
            </React.Fragment>
        )
    }
}

export default Categories