import React, {Component} from 'react'
import Sidebar from './Components/Sidebar'
import {Switch, Route, Redirect} from 'react-router-dom'
import Header from './Components/Header'
import Login from './Components/Login'
import {BounceLoader} from 'react-spinners'
import {NotificationManager, NotificationContainer} from 'react-notifications'
import Categories from './Components/Categories'
import Events from './Components/Events'
import Users from './Components/Users'

class App extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            sideOpen: false,
            loading: true,
            categories: [],
            events: [],
            users: [],
            redirect: false
        }
        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount()
    {
        let open = false
        if (document.body.clientWidth > 1000)
        {
            open = true
        }

        if (localStorage.getItem('phone') && localStorage.getItem('username'))
        {
            const phone = localStorage.getItem('phone')
            const username = localStorage.getItem('username')

            fetch('https://restful.injaunja.com/user/login/admin', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                    username: username,
                    phone: phone
                })
            })
                .then((res) => res.json())
                .then((resJson) =>
                {
                    if (resJson.state === 1)
                    {
                        this.setState({...this.state, loading: false, redirect: false, sideOpen: open}, () =>
                        {
                            this.getData()
                        })
                    }
                    else
                    {
                        this.setState({...this.state, loading: false, redirect: true, sideOpen: open})
                    }
                })
                .catch(() =>
                {
                    this.setState({...this.state, loading: false, redirect: true, sideOpen: open})
                })
        }
        else
        {
            this.setState({...this.state, loading: false, redirect: true, sideOpen: open})
        }

        window.addEventListener('resize', this.handleResize)
    }

    handleResize()
    {
        if (document.body.clientWidth <= 1000 && this.state.sideOpen)
        {
            this.setState({...this.state, sideOpen: false})
        }
    }

    componentWillUnmount()
    {
        window.removeEventListener('resize', this.handleResize)
    }

    getData()
    {
        this.setState({...this.state, loading: true}, () =>
        {
            fetch('https://restful.injaunja.com/category', {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })
                .then(res => res.json())
                .then(resJson =>
                {
                    if (resJson.state === 1)
                    {
                        this.setState({...this.state, categories: [...resJson.form]}, () =>
                        {
                            fetch('https://restful.injaunja.com/event', {
                                headers: {
                                    'Cache-Control': 'no-cache'
                                }
                            })
                                .then(res => res.json())
                                .then(resJson =>
                                {
                                    if (resJson.state === 1)
                                    {
                                        this.setState({...this.state, events: [...resJson.form]}, () =>
                                        {
                                            fetch('https://restful.injaunja.com/user/admin', {
                                                headers: {
                                                    'Cache-Control': 'no-cache',
                                                    'auth': 'QEFiZWxtaXJpIEBIb3NleW5tb3VzYXZp'
                                                }
                                            })
                                                .then(res => res.json())
                                                .then(resJson =>
                                                {
                                                    if (resJson.state === 1)
                                                    {
                                                        this.setState({...this.state, loading: false, users: [...resJson.form]})
                                                    }
                                                    else
                                                    {
                                                        this.setState({...this.state, loading: false}, () =>
                                                        {
                                                            NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید')
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
                                        })
                                    }
                                    else
                                    {
                                        this.setState({...this.state, loading: false}, () =>
                                        {
                                            NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید')
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
                        })
                    }
                    else
                    {
                        this.setState({...this.state, loading: false}, () =>
                        {
                            NotificationManager.error('خطایی هنگام برقراری سرور رخ داد. دوباره تلاش کنید')
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
        })
    }

    handleSide = () =>
    {
        this.setState({...this.state, sideOpen: !this.state.sideOpen})
    }

    handleLoading = (bool) =>
    {
        return new Promise((resolve) =>
        {
            this.setState({...this.state, loading: bool}, () => resolve())
        })
    }

    handleCollapseMain = (e) =>
    {
        if (this.state.sideOpen && document.body.clientWidth < 1000 && this.main && this.main.contains(e.target))
        {
            this.setState({...this.state, sideOpen: false})
        }
    }

    addToCategories = (category) =>
    {
        this.setState({...this.state, categories: [...this.state.categories, category]})
    }

    addToEvents = (event) =>
    {
        this.setState({...this.state, events: [...this.state.events, event]})
    }

    updateToCategories = (category) =>
    {
        return new Promise((resolve) =>
        {
            let categories = [...this.state.categories]
            for (let i = 0; i < categories.length; i++)
            {
                if (categories[i].id === category.id)
                {
                    categories[i] = category
                    this.setState({...this.state, categories: [...categories]})
                }
                if (i === (categories.length - 1))
                {
                    resolve()
                }
            }
        })
    }

    updateToEvents = (event) =>
    {
        return new Promise((resolve) =>
        {
            let events = [...this.state.events]
            for (let i = 0; i < events.length; i++)
            {
                if (events[i].id === event.id)
                {
                    events[i] = event
                    this.setState({...this.state, events: [...events]})
                }
                if (i === (events.length - 1))
                {
                    resolve()
                }
            }
        })
    }

    removeCategories = (id) =>
    {
        return new Promise((resolve) =>
        {
            let categories = [...this.state.categories]
            for (let i = 0; i < categories.length; i++)
            {
                if (categories[i].id === id)
                {
                    categories.splice(i, 1)
                    this.setState({...this.state, categories: [...categories]})
                }
                if (i === (categories.length - 1))
                {
                    resolve()
                }
            }
        })
    }

    removeEvents = (id) =>
    {
        return new Promise((resolve) =>
        {
            let events = [...this.state.events]
            for (let i = 0; i < events.length; i++)
            {
                if (events[i].id === id)
                {
                    events.splice(i, 1)
                    this.setState({...this.state, events: [...events]})
                }
                if (i === (events.length - 1))
                {
                    resolve()
                }
            }
        })
    }

    render()
    {
        return (
            <div>

                {
                    this.state.redirect ?
                        <Redirect to='/login'/>
                        :
                        null
                }

                <Switch>
                    <Route exact path='/Login' render={() =>
                        <Login handleLoading={this.handleLoading} getData={() => this.getData()}/>
                    }/>

                    <Route path='*' render={() =>
                        <React.Fragment>

                            <Header sideOpen={this.state.sideOpen} handleSide={this.handleSide}/>
                            <Sidebar sideOpen={this.state.sideOpen}/>

                            <main ref={e => this.main = e} className={this.state.sideOpen ? 'main-collapse' : 'main'} onClick={this.handleCollapseMain}>
                                <Switch>

                                    <Route exact path='/Categories' render={() =>
                                        <Categories parent_id={0}
                                                    categories={this.state.categories.filter(cat => parseInt(cat.parent_id) === 0)}
                                                    addToCategories={this.addToCategories}
                                                    updateToCategories={this.updateToCategories}
                                                    removeCategories={this.removeCategories}
                                                    handleLoading={this.handleLoading}
                                        />
                                    }/>

                                    <Route exact path='/Categories/Children/:id' render={(props) =>
                                        <Categories header={this.state.categories.filter(cat => parseInt(cat.id) === parseInt(props.match.params.id))[0] && <span>زیر دسته های <b>{this.state.categories.filter(cat => parseInt(cat.id) === parseInt(props.match.params.id))[0].name}</b></span>}
                                                    parent_id={parseInt(props.match.params.id)}
                                                    categories={this.state.categories.filter(cat => parseInt(cat.parent_id) === parseInt(props.match.params.id))}
                                                    addToCategories={this.addToCategories}
                                                    updateToCategories={this.updateToCategories}
                                                    removeCategories={this.removeCategories}
                                                    handleLoading={this.handleLoading}
                                        />
                                    }/>

                                    <Route exact path='/Events' render={() =>
                                        <Categories header={<span>لیست دسته های <b>قابل انتخاب</b></span>}
                                                    categories={this.state.categories.filter(cat => cat.selectable)}
                                                    addToCategories={false}
                                        />
                                    }/>

                                    <Route exact path='/Events/:id' render={(props) =>
                                        <Events events={this.state.events.filter(event => parseInt(event.category_id) === parseInt(props.match.params.id))}
                                                header={this.state.categories.filter(cat => parseInt(cat.id) === parseInt(props.match.params.id))[0] && <span>رویداد های <b>{this.state.categories.filter(cat => parseInt(cat.id) === parseInt(props.match.params.id))[0].name}</b></span>}
                                                addToEvents={this.addToEvents}
                                                updateToEvents={this.updateToEvents}
                                                category_id={parseInt(props.match.params.id)}
                                                removeEvents={this.removeEvents}
                                                handleLoading={this.handleLoading}
                                        />
                                    }/>

                                    <Route exact path='/Users' render={() =>
                                        <Users users={this.state.users}/>
                                    }/>

                                    <Route path='*' render={() =>
                                        <div className='welcome'>به کنترل پنل اینجا اونجا خوش آمدید</div>
                                    }/>

                                </Switch>
                            </main>

                        </React.Fragment>
                    }/>
                </Switch>

                <div className={this.state.loading ? 'modal-loading' : 'modal-hide'}>
                    <BounceLoader size={100} color='white'/>
                </div>

                <NotificationContainer/>

            </div>
        )
    }
}

export default App