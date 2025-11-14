'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAISettings, saveAISettings } from '@/lib/api';
import type { AISettings } from '@/lib/types';

type Provider = 'google-ai' | 'openai' | 'anthropic' | 'deepseek';

const modelOptions: Record<Provider, { value: string; label: string }[]> = {
  'google-ai': [
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-pro', label: 'Gemini Pro' },
  ],
  openai: [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  anthropic: [
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  ],
  deepseek: [
    { value: 'deepseek-chat', label: 'DeepSeek Chat' },
    { value: 'deepseek-coder', label: 'DeepSeek Coder' },
  ],
};


export default function AiSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AISettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const savedSettings = await getAISettings();
      setSettings(savedSettings);
    };
    fetchSettings();
  }, []);

  const handleProviderChange = (value: string) => {
    const newProvider = value as Provider;
    if (settings) {
        setSettings({
            ...settings,
            provider: newProvider,
            defaultModel: modelOptions[newProvider][0].value,
        });
    }
  };

  const handleSave = async () => {
    if (settings) {
        await saveAISettings(settings);
        toast({
            title: '设置已保存',
            description: '您的 AI 设置已成功保存。',
        });
    }
  };

  if (!settings) {
    return <div>正在加载...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI 提供商</h1>
        <p className="text-muted-foreground">
          选择您首选的 AI 提供商并配置您的 API 密钥。
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI 提供商</CardTitle>
          <CardDescription>
            选择并配置您首选的 AI 提供商。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-provider">AI 提供商</Label>
            <Select value={settings.provider} onValueChange={handleProviderChange}>
              <SelectTrigger id="ai-provider">
                <SelectValue placeholder="选择一个提供商" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google-ai">Google AI (Gemini)</SelectItem>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key">API 密钥</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="输入您的 API 密钥"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-model">默认模型</Label>
            <Select value={settings.defaultModel} onValueChange={(value) => setSettings({ ...settings, defaultModel: value }) }>
              <SelectTrigger id="default-model">
                <SelectValue placeholder="选择一个模型" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions[settings.provider].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              这是将在整个应用程序的 AI 功能中使用的默认模型。
            </p>
          </div>
          <Button onClick={handleSave}>保存 AI 设置</Button>
        </CardContent>
      </Card>
    </div>
  );
}
