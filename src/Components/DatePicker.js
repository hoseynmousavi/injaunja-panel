import React, {Component} from 'react'
import JDate from 'jalali-date'

class MyDatePicker extends Component
{
    constructor(props)
    {
        super(props)
        this.state =
            {
                firstSixMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                secondFiveMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
                esfand: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
                months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
                month: '',
                year: '',
                thisMonth: '',
                thisDay: '',
                thisYear: '',
                value: this.props.defaultValue ? this.props.defaultValue : '',
            }
        this.outside = this.outside.bind(this)
    }

    componentDidMount()
    {
        fetch('https://api.kaho.ir/DatePicker', {
            headers: {
                'Cache-Control': 'no-cache',
            },
        })
            .then(res => res.json())
            .then(resJson =>
            {
                let year = parseInt(resJson[1], 10)
                let month = parseInt(resJson[2], 10)
                let day = parseInt(resJson[3], 10)
                this.setState({
                    month: month,
                    year: year,
                    thisDay: day,
                    thisMonth: month,
                    thisYear: year,
                })
            })

        document.addEventListener('mousedown', this.outside)
    }


    componentWillReceiveProps(nextProps, nextContext)
    {
        if (nextProps.reload)
        {
            this.setState({...this.state, value: ''})
        }

        if (nextProps.defaultValue)
        {
            const value = nextProps.defaultValue
            this.setState({...this.state, value})
        }
    }

    outside(e)
    {
        if (this.main && !this.main.contains(e.target) && this.container.style.display !== 'none')
        {
            this.container.style.display = 'none'
        }
    }

    componentWillUnmount()
    {
        document.removeEventListener('mousedown', this.outside)
    }

    renderMonth()
    {
        const {month} = this.state
        if (month === 1)
        {
            return 'فروردین'
        }
        else if (month === 2)
        {
            return 'اردیبهشت'
        }
        else if (month === 3)
        {
            return 'خرداد'
        }
        else if (month === 4)
        {
            return 'تیر'
        }
        else if (month === 5)
        {
            return 'مرداد'
        }
        else if (month === 6)
        {
            return 'شهریور'
        }
        else if (month === 7)
        {
            return 'مهر'
        }
        else if (month === 8)
        {
            return 'آبان'
        }
        else if (month === 9)
        {
            return 'آذر'
        }
        else if (month === 10)
        {
            return 'دی'
        }
        else if (month === 11)
        {
            return 'بهمن'
        }
        else if (month === 12)
        {
            return 'اسفند'
        }
    }

    renderDays()
    {
        let {month, year} = this.state

        if (year > 0)
        {
            let day = new JDate([year, month, 1])
            let letter = day.format('dddd')
            if (letter === 'شنبه')
            {
                this.emp.style.width = '0px'
            }
            else if (letter === 'یکشنبه')
            {
                this.emp.style.width = '42.85px'
            }
            else if (letter === 'دوشنبه')
            {
                this.emp.style.width = '85.7px'
            }
            else if (letter === 'سه‌شنبه')
            {
                this.emp.style.width = '128.55px'
            }
            else if (letter === 'چهارشنبه')
            {
                this.emp.style.width = '171.4px'
            }
            else if (letter === 'پنج‌شنبه')
            {
                this.emp.style.width = '214.25px'
            }
            else if (letter === 'جمعه')
            {
                this.emp.style.width = '257.1px'
            }
        }


        if (month >= 1 && month <= 6)
        {
            const {firstSixMonth, thisDay, thisMonth, thisYear} = this.state

            this.daysOfWeek.style.height = '40px'

            return firstSixMonth.map((p, index) =>
            {
                if (thisDay === p && thisMonth === month && thisYear === year)
                {
                    return <button key={index} className='date-picker-this-day' onClick={() =>
                    {
                        const value = year + '/' + month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
                else
                {
                    return <button key={index} className='date-picker-day' onClick={() =>
                    {
                        const value = year + '/' + month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
            })
        }
        else if (month >= 7 && month <= 11)
        {
            const {secondFiveMonth, thisDay, thisMonth, thisYear} = this.state

            this.daysOfWeek.style.height = '40px'

            return secondFiveMonth.map((p, index) =>
            {
                if (thisDay === p && thisMonth === month && thisYear === year)
                {
                    return <button key={index} className='date-picker-this-day' onClick={() =>
                    {
                        const value = year + '/' + month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
                else
                {
                    return <button key={index} className='date-picker-day' onClick={() =>
                    {
                        const value = year + '/' + month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
            })
        }
        else if (month === 12)
        {
            const {esfand, thisDay, thisMonth, thisYear} = this.state

            this.daysOfWeek.style.height = '40px'

            return esfand.map((p, index) =>
            {
                if (thisDay === p && thisMonth === month && thisYear === year)
                {
                    return <button key={index} className='date-picker-this-day' onClick={() =>
                    {
                        const value = year + '/' + month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
                else
                {
                    return <button key={index} className='date-picker-day' onClick={() =>
                    {
                        const value = year + '/' + month + '/' + p
                        this.setState({...this.state, value}, () =>
                        {
                            this.container.style.display = 'none'
                            this.props.getValue(value)
                        })
                    }}>
                        {p}
                    </button>
                }
            })
        }

        else if (month === 0)
        {
            const {months} = this.state

            this.daysOfWeek.style.height = '0px'
            this.emp.style.width = '0px'

            return months.map((p, index) =>
                <button key={index} className='date-picker-month-0' onClick={() =>
                {
                    this.setState({month: months.indexOf(p) + 1})
                }}>
                    {p}
                </button>,
            )
        }
    }

    goPreviousMonth = () =>
    {
        let {month, year} = this.state
        if (month !== 0)
        {
            if ((month - 1) >= 1)
            {
                month--
                this.setState({month})
            }
            else
            {
                year--
                month = 12
                this.setState({month, year})
            }
        }
        else
        {
            year--
            this.setState({year})
        }
    }

    goNextMonth = () =>
    {
        let {month, year} = this.state
        if (month !== 0)
        {
            if ((month + 1) <= 12)
            {
                month++
                this.setState({month})
            }
            else
            {
                year++
                month = 1
                this.setState({month, year})
            }
        }
        else
        {
            year++
            this.setState({year})
        }
    }

    inputYear = (e) =>
    {
        if (e.target.value.length > 4) e.target.value = e.target.value.slice(0, 4)
    }

    blurYear = (e) =>
    {
        if (e.target.value.length === 4)
        {
            this.setState({year: parseInt(e.target.value, 10)}, () => e.target.value = '')
        }
        else
        {
            e.target.value = ''
        }
    }

    render()
    {
        const {className, placeHolder} = this.props
        const {value, year} = this.state

        return (
            <div className='date-picker-container' ref={e => this.main = e}>
                <input className={className ? className : 'date-picker-input'}
                       type="text"
                       value={!value.includes('null') ? value : ''}
                       onFocus={() => this.container.style.display = 'block'}
                       onChange={() => this.setState({...this.state, value: ''})}
                       placeholder={placeHolder}
                />
                <div ref={e => this.container = e} className='date-picker-calendar'>
                    <div className='date-picker-buttons'>
                        <button className='date-picker-left-arrow' onClick={this.goPreviousMonth}>
                            ❮
                        </button>
                        <button className='date-picker-show-year' onClick={() => this.setState({month: 0})}>
                            {
                                this.renderMonth()
                            }
                            <span> </span>
                            <input type='number' className='date-picker-year' placeholder={year} onInput={this.inputYear} onBlur={this.blurYear}/>
                        </button>
                        <button className='date-picker-right-arrow' onClick={this.goNextMonth}>
                            ❯
                        </button>
                    </div>

                    <div ref={e => this.daysOfWeek = e} className='date-picker-days'>
                        <button className='date-picker-show-day'>
                            شنبه
                        </button>
                        <button className='date-picker-show-day'>
                            یکشنبه
                        </button>
                        <button className='date-picker-show-day'>
                            دوشنبه
                        </button>
                        <button className='date-picker-show-day'>
                            سه شنبه
                        </button>
                        <button className='date-picker-show-day'>
                            چهارشنبه
                        </button>
                        <button className='date-picker-show-day'>
                            پنجشنبه
                        </button>
                        <button className='date-picker-show-day'>
                            جمعه
                        </button>
                    </div>
                    <div className='date-picker-days-show'>
                        <div ref={e => this.emp = e} className='date-picker-empty'>
                            <span> </span>
                        </div>
                        {
                            this.renderDays()
                        }
                    </div>
                </div>
            </div>
        )
    }

}

export default MyDatePicker
