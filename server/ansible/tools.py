import json
import shutil
from ansible.module_utils.common.collections import ImmutableDict
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible.inventory.manager import InventoryManager
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase
from ansible import context
import ansible.constants as C


def launch_vm(vm_name):
    play_source = dict(
                    hosts='localhost',
                    gather_facts='no',
                    tasks=[
                        dict(ec2=dict(region="us-east-2",
                                      key_name="main_pub",
                                      group="launch-wizard-1",
                                      instance_type="t2.micro",
                                      image="ami-0d5d9d301c853a04a",
                                      wait=True,
                                      exact_count=1,
                                      instance_tags=dict(Name=vm_name)
                                      ),
                             register="ec2"
                             )
                    ]
                        )
                        