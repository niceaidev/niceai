import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Button, Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const { t, ready } = useTranslation();
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div>
      <Form onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('auth.username.placeholder')}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder={t('auth.password.placeholder')}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">{t('auth.submit')}</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
