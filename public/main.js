$(document).ready(function () {
    _apiVeriAccount();

    $('#btn-login').on('click', async () => {
        let username = $('#username').val().trim();
        let password = $('#password').val().trim();
        await _apiLogin(username, password);
    });

    async function _apiLogin(username, password) {
        if (username.length < 1 || password.length < 1) {
            return alert('Tài khoản hoặc mật khẩu quá ngắn!');
        }
        try {
            const res = await $.post("/account/login", { username, password });
            localStorage.setItem('token', res.token);
            _hideDialogLogin();
            start()
        } catch (error) {
            console.log(error);
            _showDialogLogin();
            alert(error.responseJSON.message || 'Đã xảy ra lỗi!');
        }
    }

    async function _apiVeriAccount() {
        _showDialogLogin();
        const token = localStorage.getItem('token');
        if (!token || token.length < 10) {
            console.log('Không có token hoặc token không hợp lệ');
            return;
        }
        try {
            const res = await $.post("/account/verify", { token });
            if (res.expired) {
                console.log('LOGIN SUCCESS');
                _hideDialogLogin();
                start()
            } else {
                alert(res.message || 'Xác minh không thành công!');
                _showDialogLogin();
            }
        } catch (error) {
            console.log(error);
            _showDialogLogin();
            alert(error.responseJSON.message || 'Đã xảy ra lỗi!');
        }
    }
    async function start() {
        $.ajaxSetup({ headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
        loadListKey()
        async function loadListKey() {
            try {
                const res = await $.post("/key/getAllkey");
                console.log(res)
                for (let i = 0; i < res.length; i++) {
                    let addClassMsgNew = res[i].active ? 'bg-success' : '';
                    const user = $('<tr>', {
                        class: `${addClassMsgNew}`
                    }).html(`<th scope="row">${i + 1}</th>
                        <td>${res[i]._id}</td><td>${res[i].key}</td>
                        <td><div class="form-check"><input type="checkbox" class="form-check-input" data-userId="${res[i]._id}" ${res[i].active ? 'checked' : ''}></div></td>`);
                    $('.tableViewAllKey').append(user);
                }
            } catch (error) {
                console.log(error);
                // _showDialogLogin();
                // alert(error.responseJSON.message || 'Đã xảy ra lỗi!');
            }
        }

        $(document).on('click', '.tableViewAllKey input[type="checkbox"]', async function () {
            const userId = $(this).data('userid');
            const checked = $(this).prop('checked');
            $(this).prop('disabled', true);
            if (!checked) {
                $(this).closest('tr').removeClass('bg-success');
            } else {
                $(this).closest('tr').addClass('bg-success');
            }
            console.log(userId, checked)
            try {
                const res = await $.post("/key/active", { userId: userId, active: checked });
                alert(res.message);
            } catch (error) {
                console.error(error);
                alert('Có lỗi xảy ra khi xử lý yêu cầu.');
            } finally {
                $(this).prop('disabled', false);
            }
        });

        $(document).on('click', '.delLogs', async function () {
            try {
                const res = await $.post("/account/deleteAllLogs");
                $('.viewLogs').val('Dữ liệu rỗng')
                $('.viewLogs').css('height', '35px');
                alert(res.message)
            } catch (error) {
                console.log(error)
            }
        });

        $(document).on('click', '.loadLogs', async function () {
            try {
                const res = await $.post("/account/getLogs");
                console.log(res)
                if (res.length < 1) return alert('Không có dữ liệu')
                $('.viewLogs').css('height', '400px');
                $('.viewLogs').val('')
                for (let i = 0; i < res.length; i++) {
                    let headLine = i > 0 ? '\n' : ''
                    $('.viewLogs').val($('.viewLogs').val() + `${headLine}${res[i].content}`)
                }
            } catch (error) {
                console.log(error)
            }
        });

        $(document).on('click', '.btnChangePass', async function () {
            try {
                const passOld = $('.passOld').val().trim()
                const passNew = $('.passNew').val().trim()
                const rePassNew = $('.rePassNew').val().trim()
                if (passOld.length < 6 || passNew.length < 6 || rePassNew.length < 6) return alert('Mật khẩu quá ngắn')
                if (passNew !== rePassNew) return alert('Mật khẩu mới không khớp')

                const res = await $.post("/account/changePassword", { password: rePassNew, passwordOld: passOld });
                console.log(res)
                alert(res.message)
                $('.passOld').val('')
                $('.passNew').val('')
                $('.rePassNew').val('')
            } catch (error) {
                console.log(error)
                $('.passOld').val('')
                $('.passNew').val('')
                $('.rePassNew').val('')
                alert(error.responseJSON.message)
            }
        });
    }

    function _showDialogLogin() {
        $('#dialog_login').modal('show');
        $('main').css('opacity', '0');
    }

    function _hideDialogLogin() {
        $('#dialog_login').modal('hide');
        $('main').css('opacity', '100');
    }
});
